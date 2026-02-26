import dataModal from "../../Model/DataModal.js";

// Save data + get summary + last income/expense
const dataSave = async (req, res) => {
    try {
        const { title, type, amount, date, emoji } = req.body;

        //  Basic Validation

        if (!title || !type || amount === undefined) {
            return res.status(400).json({
                status: false,
                message: "All fields are required",
            });
        }

        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({
                status: false,
                message: "Type must be income or expense",
            });
        }

        const numericAmount = Number(amount);

        if (isNaN(numericAmount)) {
            return res.status(400).json({
                status: false,
                message: "Amount must be a number",
            });
        }

        //  Dynamic Emoji Logic

        const emojiMap = {
            income: "💸",
            expense: "💰"
        };

        const finalEmoji = emoji || emojiMap[type];

        // Save New Entry

        const newEntry = await dataModal.create({
            title: title.trim(),
            type,
            amount: numericAmount,
            date: date ? new Date(date) : new Date(),
            emoji: finalEmoji
        });

        //  Calculate Totals

        const incomeTotalAgg = await dataModal.aggregate([
            { $match: { type: "income" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const expenseTotalAgg = await dataModal.aggregate([
            { $match: { type: "expense" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalIncome = incomeTotalAgg[0]?.total || 0;
        const totalExpense = expenseTotalAgg[0]?.total || 0;

        const balance = totalIncome - totalExpense;

        // Fetch Last Income & Expense

        const lastIncome = await dataModal
            .findOne({ type: "income" })
            .sort({ createdAt: -1 });

        const lastExpense = await dataModal
            .findOne({ type: "expense" })
            .sort({ createdAt: -1 });

        // Final Response

        return res.status(200).json({
            status: true,
            message: "Data saved successfully",
            data: newEntry,
            summary: {
                totalIncome,
                totalExpense,
                balance,
                lastIncome,
                lastExpense
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message
        });
    }
};

export default dataSave;