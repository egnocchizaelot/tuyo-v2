## appFileReader.js
- **Implementation:** app/app/create/appFileReader.js
- **Summary:** Attribute directive (appFilereader) that handles file input for image uploads in donation and appreciation creation. Validates file types (jpg/jpeg/png only), enforces a maximum of 3 photos, reads files as data URLs via FileReader, checks minimum image width (500px), handles EXIF orientation correction, and updates the ngModel with the processed images.
- **Tags:** creation, donations, directive, file-upload, images
- **Dependencies:**
  - app/app/create/createDonation/creation.module.js — registered on the creation module
  - app/app/app/app.service.js — uses appService.imgMinWidth for minimum image width validation

---

## Subdirectories
- [createAppreciation/](createAppreciation/_ab_index.md) — createAppreciation — component modules
- [createDonation/](createDonation/_ab_index.md) — createDonation — component modules
