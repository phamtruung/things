const UI = {
    _IconMap: {
        Export: "y",
        Import: "x",
        Clear: "r",
        EditOpen: "H",
        EditClose: "\\",
        Show: "H",
        Hidden: "B",
        Add: "*",
        Delete: "t",
        Thing: "h",
        thingID: "h",
        things: "h",
        Person: "g",
        personID: "g",
        Tag: "T",
        tagID: "T",
        Location: "P",
        locationID: "P",
        Calendar: "Z",
        datetime: "Z",
        Note: "q",
        note: "q",
        Move: ">",
        phone: "J",
        address: "Y",
        color: "O",
        Content: "e",
        Map: "s",
        Back: "<"
    },

    //#region UI:Icon
    Icon: {
        ByText(text) {
            const el = document.createElement('p');
            el.className = 'button-icon'
            el.textContent = text;
            return el;
        },
        ByType(type) {
            return this.ByText(UI._IconMap[type]);
        },
    },

    //#region UI:Button
    Button: {
        Text(text) {
            const el = document.createElement('button');
            el.textContent = text;
            return el;
        },
        Nav(text) {
            const el = document.createElement('button');
            el.className = 'nav-btn';
            el.textContent = text;
            return el;
        },
        IconByText(textIcon) {
            const el = document.createElement('button');
            el.className = 'button-icon';
            el.textContent = textIcon;
            return el;
        },
        IconByType(type) {
            const btn = this.IconByText(UI._IconMap[type]);
            btn.title = type;
            return btn;
        },

    },
    //#region UI:Input
    Input: {
        Number(value) {
            const el = document.createElement('input');
            el.type = 'number';
            el.value = value;
            return el;
        },
        Text(text) {
            const el = document.createElement('input');
            el.type = 'text';
            el.value = text;
            return el;
        },
        TextArea(text, rows=4) {
            const el = document.createElement('textarea');
            el.className = 'input';
            el.rows = rows;
            el.value = text;
            return el;
        },
        Datetime(datetime, ) {
            const el = document.createElement('input');
            el.className = 'input';
            el.type = 'datetime-local';
            if (datetime) {
                el.value = Helper.datetimeToString(datetime);
            } else {
                el.value = "";
            }
            return el;
        },
        Select(options) {
            const elSelect = document.createElement('select');
            elSelect.className = "select";

            options.forEach(option => {
                const elOption = document.createElement('option');
                elOption.value = option.id;
                elOption.textContent = option.name;
                elOption.style.background = option.color;
                elSelect.appendChild(elOption);
            });

            return elSelect;
        },
        Color(value) {
            const el = document.createElement('input');
            el.type = 'color';
            el.value = value;
            return el;
        },
        File() {
            const el = document.createElement('input');
            el.type = 'file';
            el.accept = "application/json";
            el.style.display = "none";
            return el;
        }

    },

    //#region UI:Paragraph
    Paragraph: {
        Text(text, className=null) {
            const el = document.createElement('p');
            if (className) el.className = className;
            el.textContent = text;
            return el;
        },
        Label(text) {
            return this.Text(text, "label");
        },
        Header(text) {
            return this.Text(text, 'header');
        },
    },
    //#region UI:DIV
    Div:{
        Column(className=null) {
            const el = document.createElement('div');
            el.className = 'flex-col';
            if (className) el.classList.add(className);
            return el;
        },
        Row(className=null) {
            const el = document.createElement('div');
            el.className = 'flex-row';
            if (className) el.classList.add(className);
            return el;
        },
        Span() {
            return document.createElement('span');
        }
    },
}