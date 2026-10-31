# Security Specification for Firestore Rules

## 1. Data Invariants
- A `UserProfile` document at `/users/{userId}` can ONLY be read or updated by the user whose Auth UID matches `{userId}`.
- Creation of `/users/{userId}` requires `request.auth.uid == userId` and valid email / name formats.
- A `SavedQr` document at `/users/{userId}/savedQrs/{qrId}` can ONLY be read, created, updated, or deleted by the user whose Auth UID strictly equals `{userId}`.
- Every `SavedQr` created must have its internal `userId` field match `request.auth.uid`.

## 2. Dirty Dozen Test Payloads
1. Unauthenticated read attempt on `/users/someUserUid`.
2. Unauthenticated create attempt on `/users/someUserUid`.
3. User A attempting to read `/users/UserB`.
4. User A attempting to update `/users/UserB` profile fields.
5. User A attempting to list saved QRs in `/users/UserB/savedQrs`.
6. User A attempting to create a saved QR inside `/users/UserB/savedQrs`.
7. User A attempting to delete a saved QR inside `/users/UserB/savedQrs`.
8. Creating a saved QR with an oversized payload string (>4096 chars).
9. Creating a saved QR where `userId` field inside payload does not match `{userId}` in path.
10. Injecting malicious/junk document ID in `/users/{userId}/savedQrs/{junkDocId}`.
11. Updating immutable fields on user profile or saved QR code.
12. Blanket list queries on root collections.

## 3. Test Runner
Verified via security checks and unit validation before deployment.
