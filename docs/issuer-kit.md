# Issuer Kit Architecture and Flow

The Issuer Kit architecture is presented in the diagram below. Following the diagram are the various flows associated with the architecture diagram.

![IKP Architecture](http://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/bcgov/issuer-kit/master/docs/architecture_and_flow.puml)

## Administrator Flow

* The administrator uses github authorization to access the list of approved participants.
  * A list of administrators is managed within Keycloak.
  * Once an admin has used Keycloak to access the site, a Keycloak administrator must provide them access to the app
  * The default user (issuer-admin) has access.
* The app is a list manager that allows authorized users to add, update, email and deactivate (see below) approved users. Likely fields:
  * Email Address
  * Name
  * Jurisdiction (selection - provinces, territories and Canada, default to "BC")
  * AuthProvider (selection - GitHub only for now, default to "GitHub")
  * GUID
  * Active Until (or some field to indicate that the a GUID is time limited - configurable, defaulting to 24 hours)
  * ActiveYN
  * Audit fields (e.g. Add By, Updated By, Added Time, Updated Time)
* Associated with each approved user is a GUID and an "active until" time that is regenerated/reset each time a user record is updated and an email sent to the user.
* Deactivating a user sets the "ActiveYN" to false.
* Adding a user record sends an email (if an email server is configured) to the user with a link to the Issuer App with the GUID, and resets the "Active Until" field to a new time limit.
  * An additional "Email User" button per user allows the resending of the email, including resetting the "Active Until" field.
* The app is a basic list app, with search by email address, add and per row operations.
* The generated email is in a template can be tuned based on the parameters of the user record.
  
## Issuer Flow

* A participant receives an email with instructions on how to prepare for the demo and a link to the Issuer app.
* The Issuer app is protected by Keycloak using some number of IdPs - initially just GitHub.
* The realm should have the follow claims included in the OIDC token:
  * DisplayName
  * DateOfBirth
  * StreetAddress
  * Locality
  * PostalCode
  * EmailAddress
* The mapping from the IdP into the realm token should be best effort.
  * E.g. the github one would like populate only email address (maybe?) and/or DisplayName (perhaps with email address?). The rest of the fields would be blank, which comes into play later in the process.
* A user accesses the site via the email-embedded link, which contains a GUID for the user.
* On authorization from Keycloak, the GUID from the link is checked in the "Approved Participants" database (described above)
  * If there is no link - send to rejected screen.
    * Prompt user - do you want to participate in the project?
    * If yes - prompt user with name, email address and note. On submit, email data to configured email address, display "Email will be sent to you when you've been added to the project" message.
    * If no - display "Goodbye" text,
  * If the user record is not active (ActiveYN flag is N) - display "Project Complete" screen - no actions to be taken.
  * If there is a link that is expired - display rejected screen.
    * Prompt user - your link has expired, do you want another email?
      * Send email (configurable) email address to manually approve user and trigger email resend
    * If no - display  "Goodbye" text.
  * Otherwise - display issue verifiable credential screen.
  * Issuer verifiable credential screen
    * Instruction text at top
    * Left: List of claims from OIDC token
    * Right: List of claims for the verifiable credentials, populated from the OIDC token
    * Where the fields on the verifiable credentials side are blank, allow the user to type in values
    * An "Issue Verifiable Credential" button
      * On click, initialize an issue process - QR invitation code, etc.
      * Display a progress screen for the issuance process (same as email verification service)
    * On completion, display a link to a demo site so the user can try their new verifiable credential.
