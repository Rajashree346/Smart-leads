import { Router } from "express";
import { register, login, getMe } from "../controller/auth.controller";
import { getLeads, createLead, updateLead, deleteLead } from "../controller/lead.controller";

const router = Router();

// @route   POST /api/v1/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", register);

// @route   POST /api/v1/auth/login
// @desc    Authenticate a user & get token
// @access  Public
router.post("/login", login);

// @route   GET /api/v1/auth/me
// @desc    Get current user details
// @access  Private
router.get("/me", getMe);

// @route   GET /api/v1/auth/leads
// @desc    Get all leads (authenticated)
// @access  Private
router.get("/leads", getLeads);

// @route   POST /api/v1/auth/leads
// @desc    Create a new lead (authenticated)
// @access  Private
router.post("/leads", createLead);

// @route   PUT /api/v1/auth/leads/:id
// @desc    Update an existing lead (authenticated)
// @access  Private
router.put("/leads/:id", updateLead);

// @route   DELETE /api/v1/auth/leads/:id
// @desc    Delete a lead (authenticated)
// @access  Private
router.delete("/leads/:id", deleteLead);

export default router;
