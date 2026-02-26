import dataModal from "../../Model/DataModal.js";

export const getAllData = async (req, res) => {
    try {
        // fetch all entries
        const allData = await dataModal.find().sort({ createdAt: -1 }); // newest first

        // calculate totals
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

        // last income and last expense
        const lastIncome = await dataModal.findOne({ type: "income" }).sort({ createdAt: -1 });
        const lastExpense = await dataModal.findOne({ type: "expense" }).sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            data: allData,
            summary: {
                totalIncome,
                totalExpense,
                balance,
                lastIncome,
                lastExpense
            }
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
};