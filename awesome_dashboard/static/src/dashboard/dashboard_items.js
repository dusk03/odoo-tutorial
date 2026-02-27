import { registry } from "@web/core/registry";
import { NumberCard } from "./number_card/number_card";
import { PieChartCard } from "./pie_chart_card/pie_chart_card";

const dashboardItemsRegistry = registry.category("awesome_dashboard");

// Register: New Orders
dashboardItemsRegistry.add("new_orders", {
    id: "new_orders",
    description: "New Orders This Month",
    Component: NumberCard,
    props: (data) => ({
        title: "New Orders This Month",
        value: data.nb_new_orders,
    }),
});

// Register: Total Amount
dashboardItemsRegistry.add("total_amount", {
    id: "total_amount",
    description: "Total Amount This Month",
    Component: NumberCard,
    props: (data) => ({
        title: "Total Amount This Month",
        value: `$${data.total_amount}`,
        color: "success",
    }),
});

// Register: Average Quantity
dashboardItemsRegistry.add("average_quantity", {
    id: "average_quantity",
    description: "Average T-shirts per Order",
    Component: NumberCard,
    props: (data) => ({
        title: "Avg T-shirts per Order",
        value: data.average_quantity,
        color: "info",
    }),
});

// Register: Cancelled Orders
dashboardItemsRegistry.add("cancelled_orders", {
    id: "cancelled_orders",
    description: "Cancelled Orders This Month",
    Component: NumberCard,
    props: (data) => ({
        title: "Cancelled Orders This Month",
        value: data.nb_cancelled_orders,
        color: "danger",
    }),
});

// Register: Average Time
dashboardItemsRegistry.add("average_time", {
    id: "average_time",
    description: "Average Processing Time",
    Component: NumberCard,
    size: 2,
    props: (data) => ({
        title: "Avg Time: New → Sent/Cancelled",
        value: `${data.average_time} hours`,
        color: "warning",
    }),
});

// Register: Orders by Size
dashboardItemsRegistry.add("orders_by_size", {
    id: "orders_by_size",
    description: "T-Shirts by Size",
    Component: PieChartCard,
    size: 2,
    props: (data) => ({
        title: "T-Shirts by Size",
        data: data.orders_by_size,
    }),
});