import * as express from "express";
import AnnouncementsController from "admin/controllers/Announcements/announcements.controller";
import { validateAnnouncementsBody } from "admin/controllers/Announcements/announcements.validation";

const router = express.Router();

const {
    addAnnouncements,
    getAnnouncementss,
    getAnnouncements,
    editAnnouncements,
    deleteAnnouncements,
} = AnnouncementsController;

router.post("/add", validateAnnouncementsBody, addAnnouncements);
router.get("/list", getAnnouncementss);
router.get("/get/:id", getAnnouncements);
router.put("/edit/:id", validateAnnouncementsBody, editAnnouncements);
router.delete("/delete", deleteAnnouncements);

export default router;


