/* ═══════════════════════════════════════════════════
   TATA AIA INSURANCE AGENT PORTAL — EXPRESS SERVER
   MongoDB: mongodb://localhost:27017/
   ═══════════════════════════════════════════════════ */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/tata_aia_insurance';

// ── MIDDLEWARE ─────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── MONGODB CONNECTION ────────────────────────────
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB: tata_aia_insurance'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ── SCHEMAS & MODELS ──────────────────────────────

// Policy Schema
const policySchema = new mongoose.Schema({
    policyId: { type: String, required: true, unique: true },
    // Customer Details
    customerName: { type: String, required: true },
    customerDob: { type: String },
    customerGender: { type: String },
    customerPhone: { type: String },
    customerEmail: { type: String },
    customerAddress: { type: String },
    nomineeName: { type: String },
    nomineeRelation: { type: String },
    // Policy Details
    planType: { type: String, required: true },
    sumAssured: { type: Number, required: true },
    policyTerm: { type: Number },
    premiumFrequency: { type: String },
    premiumAmount: { type: Number },
    policyStartDate: { type: String },
    policyEndDate: { type: String },
    maturityBenefit: { type: Number },
    signature: { type: String }, // Base64 string from signature pad
    // Payment
    paymentMethod: { type: String },
    paymentStatus: { type: String, default: 'Completed' },
    // Status
    status: { type: String, default: 'Active', enum: ['Active', 'Pending', 'Expired'] },
    createdAt: { type: Date, default: Date.now }
});

const Policy = mongoose.model('Policy', policySchema);

// Agent Profile Schema
const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, default: 'Senior Insurance Advisor' },
    irdaNo: { type: String },
    phone: { type: String },
    email: { type: String },
    branch: { type: String },
});

const Agent = mongoose.model('Agent', agentSchema);

// User Schema for Authentication
const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In production, use bcrypt
    resetToken: { type: String }
});

const User = mongoose.model('User', userSchema);

// ── SEED DATA ─────────────────────────────────────
async function seedData() {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
        await User.create({
            userId: 'admin123',
            email: 'swyamarora@gmail.com',
            password: 'password123'
        });
        console.log('✅ Default user seeded: admin123 / password123');
    }

    const count = await Policy.countDocuments();
    if (count === 0) {
        console.log('📦 Seeding sample policies...');
        const samplePolicies = [
            { policyId: 'TAIA-2025-001', customerName: 'Priya Sharma', planType: 'Term Plan', sumAssured: 5000000, premiumAmount: 18500, policyStartDate: '2025-01-15', status: 'Active', customerPhone: '+91 99887 76655', customerEmail: 'priya@email.com', premiumFrequency: 'Annually', policyTerm: 20 },
            { policyId: 'TAIA-2025-002', customerName: 'Rajesh Kumar', planType: 'ULIP', sumAssured: 2500000, premiumAmount: 45000, policyStartDate: '2025-02-01', status: 'Active', customerPhone: '+91 98765 11223', customerEmail: 'rajesh@email.com', premiumFrequency: 'Annually', policyTerm: 15 },
            { policyId: 'TAIA-2025-003', customerName: 'Anjali Verma', planType: 'Health Plan', sumAssured: 1000000, premiumAmount: 12800, policyStartDate: '2025-02-20', status: 'Active', customerPhone: '+91 91234 56789', customerEmail: 'anjali@email.com', premiumFrequency: 'Monthly', policyTerm: 10 },
            { policyId: 'TAIA-2025-004', customerName: 'Suresh Patel', planType: 'Savings', sumAssured: 1500000, premiumAmount: 22000, policyStartDate: '2025-03-05', status: 'Active', customerPhone: '+91 88776 65544', customerEmail: 'suresh@email.com', premiumFrequency: 'Quarterly', policyTerm: 20 },
            { policyId: 'TAIA-2025-005', customerName: 'Meena Iyer', planType: 'Term Plan', sumAssured: 10000000, premiumAmount: 32000, policyStartDate: '2024-12-10', status: 'Active', customerPhone: '+91 77665 54433', customerEmail: 'meena@email.com', premiumFrequency: 'Annually', policyTerm: 25 },
            { policyId: 'TAIA-2025-006', customerName: 'Vikram Singh', planType: 'Retirement', sumAssured: 3000000, premiumAmount: 28500, policyStartDate: '2024-11-20', status: 'Active', customerPhone: '+91 66554 43322', customerEmail: 'vikram@email.com', premiumFrequency: 'Annually', policyTerm: 30 },
            { policyId: 'TAIA-2025-007', customerName: 'Deepa Nair', planType: 'ULIP', sumAssured: 2000000, premiumAmount: 38000, policyStartDate: '2024-10-01', status: 'Active', customerPhone: '+91 55443 32211', customerEmail: 'deepa@email.com', premiumFrequency: 'Quarterly', policyTerm: 15 },
            { policyId: 'TAIA-2025-008', customerName: 'Arun Joshi', planType: 'Term Plan', sumAssured: 7500000, premiumAmount: 24000, policyStartDate: '2024-08-15', status: 'Active', customerPhone: '+91 44332 21100', customerEmail: 'arun@email.com', premiumFrequency: 'Annually', policyTerm: 20 },
            { policyId: 'TAIA-2024-009', customerName: 'Kavita Reddy', planType: 'Health Plan', sumAssured: 500000, premiumAmount: 8900, policyStartDate: '2024-06-01', status: 'Pending', customerPhone: '+91 33221 10099', customerEmail: 'kavita@email.com', premiumFrequency: 'Monthly', policyTerm: 10 },
            { policyId: 'TAIA-2024-010', customerName: 'Manish Gupta', planType: 'Savings', sumAssured: 1000000, premiumAmount: 15000, policyStartDate: '2023-12-01', status: 'Pending', customerPhone: '+91 22110 09988', customerEmail: 'manish@email.com', premiumFrequency: 'Annually', policyTerm: 20 },
            { policyId: 'TAIA-2023-011', customerName: 'Sunita Devi', planType: 'Term Plan', sumAssured: 2500000, premiumAmount: 9500, policyStartDate: '2023-01-15', status: 'Expired', customerPhone: '+91 11009 98877', customerEmail: 'sunita@email.com', premiumFrequency: 'Annually', policyTerm: 10 },
            { policyId: 'TAIA-2023-012', customerName: 'Ravi Tiwari', planType: 'Retirement', sumAssured: 4000000, premiumAmount: 52000, policyStartDate: '2022-07-01', status: 'Active', customerPhone: '+91 99008 87766', customerEmail: 'ravi@email.com', premiumFrequency: 'Annually', policyTerm: 30 },
        ];
        await Policy.insertMany(samplePolicies);
        console.log('✅ 12 sample policies seeded');
    }

    const agentCount = await Agent.countDocuments();
    if (agentCount === 0) {
        await Agent.create({
            name: 'Swyam Arora',
            role: 'Senior Insurance Advisor',
            irdaNo: 'IRDA/AG/2024/001234',
            phone: '+91 81683 77059',
            email: 'swyamarora@gmail.com',
            branch: 'Mumbai — Andheri West',
        });
        console.log('✅ Agent profile seeded');
    }
}

// ── API ROUTES ────────────────────────────────────

// GET all policies (with optional search)
app.get('/api/policies', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { customerName: { $regex: search, $options: 'i' } },
                    { policyId: { $regex: search, $options: 'i' } },
                    { planType: { $regex: search, $options: 'i' } },
                ]
            };
        }
        const policies = await Policy.find(query).sort({ createdAt: -1 });
        res.json(policies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET policy stats
app.get('/api/policies/stats', async (req, res) => {
    try {
        const total = await Policy.countDocuments();
        const active = await Policy.countDocuments({ status: 'Active' });
        const pending = await Policy.countDocuments({ status: 'Pending' });
        const expired = await Policy.countDocuments({ status: 'Expired' });

        const allPolicies = await Policy.find();
        let totalPremium = 0;
        allPolicies.forEach(p => { totalPremium += p.premiumAmount || 0; });

        res.json({ total, active, pending, expired, totalPremium });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single policy by ID
app.get('/api/policies/:id', async (req, res) => {
    try {
        const policy = await Policy.findById(req.params.id);
        if (!policy) return res.status(404).json({ error: 'Policy not found' });
        res.json(policy);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create new policy
app.post('/api/policies', async (req, res) => {
    try {
        // Generate policy ID
        const count = await Policy.countDocuments();
        const policyId = `TAIA-2025-${String(count + 1).padStart(3, '0')}`;

        const policy = new Policy({
            policyId,
            ...req.body
        });
        await policy.save();
        res.status(201).json(policy);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update policy status
app.put('/api/policies/:id', async (req, res) => {
    try {
        const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!policy) return res.status(404).json({ error: 'Policy not found' });
        res.json(policy);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE policy
app.delete('/api/policies/:id', async (req, res) => {
    try {
        const policy = await Policy.findByIdAndDelete(req.params.id);
        if (!policy) return res.status(404).json({ error: 'Policy not found' });
        res.json({ message: 'Policy deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET analytics for graphs
app.get('/api/analytics', async (req, res) => {
    try {
        const monthlyData = await Policy.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                    premium: { $sum: "$premiumAmount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const planDistribution = await Policy.aggregate([
            {
                $group: {
                    _id: "$planType",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({ monthlyData, planDistribution });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── AUTHENTICATION ROUTES ────────────────────────
app.post('/api/login', async (req, res) => {
    const { userId, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ userId: userId }, { email: userId }],
            password: password
        });

        if (user) {
            res.json({ success: true, message: 'Login successful', user: { userId: user.userId, email: user.email } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/forgot-password', async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ userId: userId }, { email: userId }]
        });

        if (user) {
            // Simulate sending email by updating a resetToken
            const token = Math.floor(Math.random() * 900000) + 100000; // 6-digit PIN
            user.resetToken = token.toString();
            await user.save();

            res.json({
                success: true,
                message: `Reset PIN sent to ${user.email}`,
                debugToken: token // Shown for demo/Postman testing
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET agent profile
app.get('/api/agent', async (req, res) => {
    try {
        const agent = await Agent.findOne();
        res.json(agent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update agent profile
app.put('/api/agent/:id', async (req, res) => {
    try {
        const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(agent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ── SERVE FRONTEND ────────────────────────────────
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── START SERVER ──────────────────────────────────
app.listen(PORT, async () => {
    console.log(`\n🚀 Tata AIA Insurance Portal running at: http://localhost:${PORT}`);
    console.log(`📊 MongoDB: ${MONGO_URI}\n`);
    await seedData();
});
