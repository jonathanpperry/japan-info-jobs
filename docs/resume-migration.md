# Résumé migration

Ports the old app's six required fields and top-level `resumes` collection with
`uid` ownership. Existing documents in the configured Firebase project remain
readable; this does not copy documents between Firebase projects.

Routes:
- `/tabs/resumes`: current user's list, refreshed whenever the tab is entered.
- `/createresume`: create.
- `/resume/:id`: view and confirmed deletion.
- `/editresume/:id`: edit.

Job application submission and PDF/file upload are outside this change.

## Firestore rules prerequisite

The repository does not contain the deployed Firestore rules. Client ownership
checks are only UX checks. Before using this feature, merge the following match
block into the existing `match /databases/{database}/documents` block in the
Firebase console. Preserve the existing jobs/users/bookmarks rules.

Review any broad catch-all allow rule: Firebase combines matching allows, so a
permissive catch-all would override this restriction. Do not deploy this fragment
as a replacement for the complete rules file.

```text
match /resumes/{resumeId} {
  function signedIn() {
    return request.auth != null;
  }
  function validText(value) {
    return value is string && value.size() > 0 && value.size() <= 10000;
  }
  function validResume() {
    let d = request.resource.data;
    return validText(d.title)
      && validText(d.languageAbilities)
      && validText(d.careerObjectives)
      && validText(d.specialties)
      && validText(d.educationalHistory)
      && validText(d.workHistory);
  }
  allow read, delete: if signedIn() && resource.data.uid == request.auth.uid;
  allow create: if signedIn()
    && request.resource.data.uid == request.auth.uid
    && request.resource.data.keys().hasOnly([
      'uid', 'title', 'languageAbilities', 'careerObjectives',
      'specialties', 'educationalHistory', 'workHistory',
      'createdAt', 'updatedAt'
    ])
    && validResume();
  allow update: if signedIn()
    && resource.data.uid == request.auth.uid
    && request.resource.data.uid == resource.data.uid
    && request.resource.data.diff(resource.data).affectedKeys().hasOnly([
      'title', 'languageAbilities', 'careerObjectives',
      'specialties', 'educationalHistory', 'workHistory', 'updatedAt'
    ])
    && validResume();
}
```

## Validation before merge

The authoring session had no runnable execution environment. Build, tests and
device behavior are unverified.

1. Run `npm ci`, `npm run build`, and `npm test -- --watch=false`.
2. Create a résumé with all six fields. Check empty and whitespace-only fields
   cannot be saved. Verify the list and detail page show the saved text.
3. Edit it, return to the list, then close/reopen the app and verify persistence.
4. Cancel a delete confirmation, then confirm deletion and check the empty state.
5. Deny writes or disconnect networking and verify no successful navigation occurs
   before a confirmed save. Restore connectivity and verify recovery.
6. With a second account, verify the list excludes the first account's résumés
   and direct detail/edit URLs cannot read or modify them.
7. In the Firestore emulator or rules playground, verify unauthenticated access,
   foreign-owner reads/updates/deletes, and changes to uid are denied.
8. Confirm existing login, bookmarks and job browsing still work.

Firestore may keep a write pending while offline; the saving state deliberately
waits for server acknowledgement. No application is sent to an employer.
