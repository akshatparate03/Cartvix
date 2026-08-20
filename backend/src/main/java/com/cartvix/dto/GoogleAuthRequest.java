package com.cartvix.dto;

import lombok.Data;

/**
 * Sent from frontend after Google OAuth popup completes.
 * The frontend sends the Google ID token (credential) which
 * we verify on the backend using Google's tokeninfo endpoint.
 */
@Data
public class GoogleAuthRequest {
    private String credential; // Google ID token (JWT from Google)

    // FEATURE: "CUSTOMER" or "SELLER" — only used the FIRST time this Google
    // account signs in (i.e. when we auto-create the user). Ignored on
    // subsequent logins since the account already has a role.
    private String role;
}