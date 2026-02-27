import { Component, useState } from "@odoo/owl";
import { Dialog } from "@web/core/dialog/dialog";

export class ConfigurationDialog extends Component {
    static template = "awesome_dashboard.ConfigurationDialog";
    static components = { Dialog };
    static props = {
        allItems: Array,
        removedItems: Array,
        close: Function,
        onApply: Function,
    };

    setup() {
        // Create a state object with checked status for each item
        this.state = useState({
            itemStates: {},
        });

        // Initialize item states based on removedItems
        for (const item of this.props.allItems) {
            this.state.itemStates[item.id] = !this.props.removedItems.includes(item.id);
        }
    }

    onCheckboxChange(itemId) {
        this.state.itemStates[itemId] = !this.state.itemStates[itemId];
    }

    onApply() {
        // Build list of removed item IDs (unchecked items)
        const removedItems = [];
        for (const item of this.props.allItems) {
            if (!this.state.itemStates[item.id]) {
                removedItems.push(item.id);
            }
        }
        
        // Call the callback with removed items
        this.props.onApply(removedItems);
        
        // Close the dialog
        this.props.close();
    }
}