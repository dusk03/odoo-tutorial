import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { useService } from "@web/core/utils/hooks";
import { DashboardItem } from "./dashboard_item/dashboard_item";
import { ConfigurationDialog } from "./configuration_dialog/configuration_dialog";

const DASHBOARD_CONFIG_KEY = "awesome_dashboard.configuration";

export class AwesomeDashboard extends Component {
    static template = "awesome_dashboard.AwesomeDashboard";
    static components = { Layout, DashboardItem };
    
    setup() {
        this.action = useService("action");
        this.dialog = useService("dialog");
        const statisticsService = useService("awesome_dashboard.statistics");
        
        // Subscribe to the reactive object from the service
        this.statistics = useState(statisticsService.statistics);
        
        // Get all available dashboard items from the registry
        this.allItems = registry.category("awesome_dashboard").getAll();
        
        // State for removed items configuration
        this.state = useState({
            removedItems: this.loadConfiguration(),
        });
        console.log(registry.category("awesome_dashboard").getAll())
    }

    get items() {
        // Filter out removed items
        return this.allItems.filter(item => !this.state.removedItems.includes(item.id));
    }

    loadConfiguration() {
        // Load configuration from local storage
        try {
            const config = localStorage.getItem(DASHBOARD_CONFIG_KEY);
            return config ? JSON.parse(config) : [];
        } catch (error) {
            console.error("Failed to load dashboard configuration:", error);
            return [];
        }
    }

    saveConfiguration(removedItems) {
        // Save configuration to local storage
        try {
            localStorage.setItem(DASHBOARD_CONFIG_KEY, JSON.stringify(removedItems));
            this.state.removedItems = removedItems;
        } catch (error) {
            console.error("Failed to save dashboard configuration:", error);
        }
    }

    openConfiguration() {
        this.dialog.add(ConfigurationDialog, {
            allItems: this.allItems,
            removedItems: this.state.removedItems,
            onApply: (removedItems) => {
                this.saveConfiguration(removedItems);
            },
        });
    }

    openCustomers() {
        this.action.doAction("base.action_partner_form");
    }

    openLeads() {
        this.action.doAction({
            type: "ir.actions.act_window",
            name: "Leads",
            res_model: "crm.lead",
            views: [
                [false, "list"],
                [false, "form"],
            ],
        });
    }
}

// Register to lazy_components instead of actions
registry.category("lazy_components").add("AwesomeDashboard", AwesomeDashboard);