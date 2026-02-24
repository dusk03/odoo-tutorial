from odoo import models, Command
from odoo.exceptions import UserError


class EstateProperty(models.Model):
    _inherit = "estate.property"

    def action_sold(self):
        for prop in self:
            if not prop.buyer_id:
                raise UserError(
                    "A buyer must be set before marking a property as sold."
                )

        res = super().action_sold()

        journal = self.env["account.journal"].search(
            [("type", "=", "sale")],
            limit=1
        )

        for prop in self:
            self.env["account.move"].create(
                {
                    "move_type": "out_invoice",
                    "partner_id": prop.buyer_id.id,
                    "journal_id": journal.id,
                    "invoice_line_ids": [
                        Command.create({
                            "name": f"6% commission on {prop.name}",
                            "quantity": 1,
                            "price_unit": prop.selling_price * 0.06,
                        }),
                        Command.create({
                            "name": "Administrative fees",
                            "quantity": 1,
                            "price_unit": 100.00,
                        }),
                    ],
                }
            )

        return res