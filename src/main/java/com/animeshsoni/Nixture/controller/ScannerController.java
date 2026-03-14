package com.animeshsoni.Nixture.controller;

import com.animeshsoni.Nixture.config.SecurityHeader;
import com.animeshsoni.Nixture.model.AnalyzeRequest;
import com.animeshsoni.Nixture.model.AnalyzeResponse;
import com.animeshsoni.Nixture.model.HeaderResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

@RestController
public class ScannerController {

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(20))
            .followRedirects(HttpClient.Redirect.ALWAYS)
            .build();

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeUrl(@RequestBody AnalyzeRequest request) {
        String url = request.getUrl() != null ? request.getUrl().trim() : "";

        if (url.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "URL cannot be empty."));
        }

        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }

        try {
            // Build the request mimicking a real browser to bypass basic blocks
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(20))
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8")
                    .GET()
                    .build();

            // Send request and get headers
            HttpResponse<Void> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.discarding());
            var serverHeaders = response.headers().map();

            List<HeaderResult> results = new ArrayList<>();
            List<String> recommendations = new ArrayList<>();
            int score = 0;
            int maxScore = Arrays.stream(SecurityHeader.values()).mapToInt(SecurityHeader::getWeight).sum();

            // Analyze headers against our Enum configuration
            for (SecurityHeader config : SecurityHeader.values()) {
                // Java HttpResponse headers map keys are always lowercase
                List<String> headerValues = serverHeaders.get(config.getHeaderKey().toLowerCase());
                boolean isPresent = (headerValues != null && !headerValues.isEmpty());
                String value = isPresent ? String.join(", ", headerValues) : null;

                if (isPresent) {
                    score += config.getWeight();
                } else {
                    recommendations.add(config.getRecMsg());
                }

                results.add(new HeaderResult(
                        config.getHeaderKey(),
                        config.getLabel(),
                        isPresent,
                        value != null ? value : "Not Set / Missing",
                        isPresent ? null : config.getRiskMsg()
                ));
            }

            int finalScore = (int) (((double) score / maxScore) * 100);
            int statusCode = response.statusCode();
            boolean wafSuspected = false;

            // WAF Detection Logic (Translated from your Python script)
            List<Integer> blockedCodes = Arrays.asList(403, 429);
            if ((statusCode == 200 || blockedCodes.contains(statusCode)) && finalScore == 0) {
                wafSuspected = true;
                String reason = switch (statusCode) {
                    case 403 -> "Access Denied (403)";
                    case 429 -> "Rate Limited / Access Denied (429)";
                    default -> "Headers Hidden / Stripped";
                };
                recommendations.add(0, "⚠️ <strong>Firewall Detected:</strong> " + reason + ". Scanner was blocked.");
            }

            AnalyzeResponse finalResponse = new AnalyzeResponse(url, finalScore, results, recommendations, wafSuspected, statusCode);
            return ResponseEntity.ok(finalResponse);

        } catch (java.net.http.HttpTimeoutException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Timeout: The server took too long to respond (over 20 seconds)."));
        } catch (javax.net.ssl.SSLHandshakeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "SSL Error: The target website's security certificate is invalid or expired."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Connection Failed: Website unreachable or invalid domain."));
        }
    }
}