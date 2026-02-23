from odoo import api, fields, models
from dateutil.relativedelta import relativedelta
from odoo.exceptions import UserError

class EstatePropertyOffer(models.Model):
    _name = "estate.property.offer"
    _description = "Real Estate Property Offer"
    
    price = fields.Float()
    status = fields.Selection(
        selection=[
            ('accepted', 'Accepted'),
            ('refused', 'Refused'),
        ],
        copy=False,
    )
    partner_id = fields.Many2one("res.partner", string="Buyer", required=True)
    property_id = fields.Many2one("estate.property", string="Property", required=True)
    validity = fields.Integer(string="Validity (days)", default=7)
    date_deadline = fields.Date(
        string="Deadline",
        compute="_compute_date_deadline",
        inverse="_inverse_date_deadline",
        store=True,
    )
    
    @api.depends("validity", "create_date")
    def _compute_date_deadline(self):
        for record in self:
            # Fall back to today if create_date is not yet set (during creation)
            start = record.create_date.date() if record.create_date else fields.Date.today()
            record.date_deadline = start + relativedelta(days=record.validity)

    def _inverse_date_deadline(self):
        for record in self:
            start = record.create_date.date() if record.create_date else fields.Date.today()
            record.validity = (record.date_deadline - start).days

    def action_accept(self):
        for record in self:
            # Ensure no other offer is already accepted for this property
            if "accepted" in record.property_id.offer_ids.mapped("status"):
                raise UserError("Another offer has already been accepted for this property.")
            record.status = "accepted"
            record.property_id.selling_price = record.price
            record.property_id.buyer_id = record.partner_id
            record.property_id.state = "offer_accepted"
        return True

    def action_refuse(self):
        for record in self:
            if record.status == "accepted":
                # Clear the property's buyer and selling price if the accepted offer is refused
                record.property_id.selling_price = 0
                record.property_id.buyer_id = False
                record.property_id.state = "offer_received"
            record.status = "refused"
        return True

    @api.model_create_multi
    def create(self, vals_list):
        records = super().create(vals_list)
        for record in records:
            record.property_id.state = "offer_received"
        return records