package com.animeshsoni.Nixture.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record AnalyzeResponse(
        String target,
        int score,
        @JsonProperty("headers_analyzed") List<HeaderResult> headersAnalyzed,
        List<String> recommendations,
        @JsonProperty("waf_suspected") boolean wafSuspected,
        @JsonProperty("status_code") int statusCode
) {}