
Ext.define('Shopware.apps.Customer.view.customer_stream.conditions.field.AttributeValue', {
    extend: 'Ext.form.FieldContainer',
    layout: { type: 'vbox', align: 'stretch' },
    mixins: {
        formField: 'Ext.form.field.Base'
    },

    initComponent: function() {
        var me = this;

        me.items = me.createItems();

        me.operator = me.operatorField.getValue();

        me.operatorField.on('change', function (field, value) {
            me.operator = value;

            if (value === 'BETWEEN') {
                me.betweenContainer.show();
                me.valueField.hide();
                me.fromField.setDisabled(false);
                me.toField.setDisabled(false);
                me.valueField.setDisabled(true);
            } else {
                me.betweenContainer.hide();
                me.valueField.show();
                me.fromField.setDisabled(true);
                me.toField.setDisabled(true);
                me.valueField.setDisabled(false);
            }
        });

        me.callParent(arguments);
    },

    createItems: function () {
        var me = this;

        return [
            me.createValueField(),
            me.createBetweenContainer()
        ];
    },

    getValue: function() {
        var value = this.valueField.getValue();

        if (this.operator === 'BETWEEN') {
            return {
                min: this.fromField.getValue(),
                max: this.toField.getValue()
            };
        } else if (this.operator === 'IN') {
            return value.split(",");
        }

        return value;
    },

    setValue: function(value) {
        var me = this;

        if (Ext.isObject(value)) {
            me.fromField.setValue(value.min);
            me.toField.setValue(value.max);

            return;
        }
        me.valueField.setValue(value);
    },

    getSubmitData: function() {
        var result = {};
        result[this.name] = this.getValue();

        return result;
    },

    createFromField: function() {
        var me = this;

        me.fromField = Ext.create('Ext.form.field.Number', {
            fieldLabel: '{s name=attribute/from_text}From{/s}',
            flex: 1,
            allowBlank: false,
            listeners: {
                change: function() {
                    me.toField.setMinValue(this.getValue() + 1);
                }
            }
        });
        return me.fromField;
    },

    createToField: function() {
        var me = this;

        me.toField = Ext.create('Ext.form.field.Number', {
            labelWidth: 50,
            allowBlank: false,
            fieldLabel: '{s name=attribute/to_text}to{/s}',
            padding: '0 0 0 10',
            flex: 1,
            listeners: {
                change: function() {
                    me.fromField.setMaxValue(this.getValue() - 1);
                }
            }
        });
        return me.toField;
    },

    createValueField: function () {
        var me = this;

        me.valueField = Ext.create('Ext.form.field.Text', {
            fieldLabel: '{s name=attribute/value}Value:{/s}',
            allowBlank: false,
            name: 'value'
        });
        return me.valueField;
    },

    createBetweenContainer: function () {
        var me = this;

        me.betweenContainer = Ext.create('Ext.container.Container', {
            layout: { type: 'hbox', alaign: 'strech' },
            hidden: true,
            items: [me.createFromField(), me.createToField()]
        });
        return me.betweenContainer;
    }
});