import { Component, useState, markup } from "@odoo/owl";
import { Counter } from "./counter/counter";
import { Card } from "./card/card";
import { TodoList } from "./todo_list/todo_list";

export class Playground extends Component {
    static template = "awesome_owl.playground";
    static components = { Counter, Card, TodoList };

    setup() {
        this.state = useState({ sum: 0 });
        
        this.plainHtml = "<strong>This will be escaped</strong>";
        this.safeHtml = markup("<strong>This is bold text</strong>");
        this.richContent = markup(`
            <div>
                <p>This is a <em>paragraph</em> with <strong>formatting</strong>.</p>
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                </ul>
            </div>
        `);
    }

    incrementSum(value) {
        this.state.sum += value;
    }
}