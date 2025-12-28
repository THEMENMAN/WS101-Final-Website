package com.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Job categories used across the application.
 * Provides a tolerant parser and friendly display names for JSON.
 */
public enum JobCategory {
    WEB_DEVELOPMENT("Web Development"),
    GRAPHIC_DESIGN("Graphic Design"),
    WRITING("Writing"),
    MARKETING("Marketing"),
    MOBILE_DEVELOPMENT("Mobile Development"),
    DATA_SCIENCE("Data Science"),
    OTHER("Other");

    private final String displayName;

    JobCategory(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return name();
    }

    /**
     * Tolerant parser that accepts case-insensitive names, display names, and common variants.
     */
    @JsonCreator
    public static JobCategory fromString(String s) {
        if (s == null || s.trim().isEmpty()) {
            throw new IllegalArgumentException("Job category must be provided");
        }
        String normalized = s.trim().toUpperCase().replaceAll("[\s-]+", "_");
        for (JobCategory c : values()) {
            if (c.name().equalsIgnoreCase(normalized) || c.displayName.equalsIgnoreCase(s.trim())) {
                return c;
            }
        }
        throw new IllegalArgumentException("Unknown job category: '" + s + "'. Supported values: " + supported());
    }

    public static String supported() {
        StringBuilder sb = new StringBuilder();
        for (JobCategory c : values()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(c.displayName);
        }
        return sb.toString();
    }
}
