package com.animeshsoni.Nixture.config;

public enum SecurityHeader {

    HSTS("Strict-Transport-Security", 30, "HSTS",
            "HSTS is disabled. Vulnerable to SSL Stripping and Downgrade attacks.",
            "Enable HSTS (Strict-Transport-Security) to force browsers to use secure HTTPS connections."),

    CSP("Content-Security-Policy", 25, "CSP",
            "CSP is missing. Highly vulnerable to Cross-Site Scripting (XSS) and Data Injection.",
            "Implement a Content-Security-Policy (CSP) to strictly define allowed sources for scripts and media."),

    X_FRAME_OPTIONS("X-Frame-Options", 15, "X-Frame-Options",
            "Header missing. The website can be embedded in an external iframe, leading to Clickjacking risks.",
            "Set X-Frame-Options to DENY or SAMEORIGIN to mitigate Clickjacking attacks."),

    X_CONTENT_TYPE_OPTIONS("X-Content-Type-Options", 10, "X-Content-Type-Options",
            "MIME-sniffing risk. Browsers might incorrectly execute image or text files as malicious scripts.",
            "Set this header to 'nosniff' to force the browser to respect the declared content type."),

    REFERRER_POLICY("Referrer-Policy", 10, "Referrer-Policy",
            "Referrer Policy is not set. Sensitive user navigation data might leak to third-party domains.",
            "Configure a Referrer-Policy (e.g., strict-origin-when-cross-origin) to protect user privacy during navigation."),

    PERMISSIONS_POLICY("Permissions-Policy", 5, "Permissions-Policy",
            "Access to powerful browser features (camera, microphone, geolocation) is not explicitly restricted.",
            "Use Permissions-Policy to explicitly define and restrict which browser features this site is allowed to access."),

    X_XSS_PROTECTION("X-XSS-Protection", 5, "X-XSS-Protection",
            "Legacy XSS protection is disabled (Note: CSP is the modern standard, but this helps older browsers).",
            "Enable this header (value: '1; mode=block') to provide an additional layer of XSS filtering for legacy web browsers.");

    private final String headerKey;
    private final int weight;
    private final String label;
    private final String riskMsg;
    private final String recMsg;

    SecurityHeader(String headerKey, int weight, String label, String riskMsg, String recMsg) {
        this.headerKey = headerKey;
        this.weight = weight;
        this.label = label;
        this.riskMsg = riskMsg;
        this.recMsg = recMsg;
    }

    public String getHeaderKey() { return headerKey; }
    public int getWeight() { return weight; }
    public String getLabel() { return label; }
    public String getRiskMsg() { return riskMsg; }
    public String getRecMsg() { return recMsg; }
}