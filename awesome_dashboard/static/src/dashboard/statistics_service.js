import { registry } from "@web/core/registry";
import { rpc } from "@web/core/network/rpc";
import { reactive } from "@odoo/owl";

export const statisticsService = {
    dependencies: [],
    
    start(env) {
        // Create a reactive object with initial state
        const statistics = reactive({
            nb_new_orders: 0,
            total_amount: 0,
            average_quantity: 0,
            nb_cancelled_orders: 0,
            average_time: 0,
            orders_by_size: {},
        });

        // Function to load and update statistics
        async function loadStatistics() {
            const data = await rpc("/awesome_dashboard/statistics");
            // Update the reactive object in place
            Object.assign(statistics, data);
        }

        // Load initial data
        loadStatistics();

        // Set up periodic reload every 10 seconds (use 600000 for 10 minutes)
        const intervalId = setInterval(() => {
            loadStatistics();
        }, 50000); // 10 seconds for testing, change to 600000 for 10 minutes

        // Clean up interval when service is destroyed
        env.services["bus_service"]?.addEventListener("window_focus", () => {
            // Optional: reload when window regains focus
            loadStatistics();
        });

        return {
            statistics,
            loadStatistics,
        };
    },
};

registry.category("services").add("awesome_dashboard.statistics", statisticsService);