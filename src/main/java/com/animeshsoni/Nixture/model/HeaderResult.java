package com.animeshsoni.Nixture.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public record HeaderResult(
        String header,
        String label,
        boolean present,
        String value,
        @JsonProperty("risk_msg") String riskMsg
) {}