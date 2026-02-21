class App {

    //#region App
    constructor({elBody, data, appName}) {
        // Style
        this.classCol = 'border';
        this.classHeader = "solid-heavy";
        this.className = "underline";
        this.classBtn = "solid";
        this.classChildren = 'solid-alpha';
        this.left = "0.7rem";

        // Apply
        this.elBody = elBody;
        this.data = data;
        this.appName = appName;

        // Name
        this.elAppName = UI.Div.Row(this.classHeader);
        this.elAppName.appendChild(UI.Paragraph.Header(appName));
        this.elBody.appendChild(this.elAppName);

        // Button Export
        this.elBtnExport = UI.Button.IconByType("Export");
        this.elBtnExport.classList.add(this.classHeader);
        this.elAppName.appendChild(this.elBtnExport);

        // Button Import
        this.elBtnImport = UI.Button.IconByType("Import");
        this.elBtnImport.classList.add(this.classHeader);
        this.elAppName.appendChild(this.elBtnImport);

        // File Import
        this.elFileImport = UI.Input.File();

        // Button Clear
        this.elBtnClear = UI.Button.IconByType("Clear");
        this.elBtnClear.classList.add(this.classHeader);
        this.elAppName.appendChild(this.elBtnClear);

        // Header
        this.elHeader = UI.Div.Row();

        // Button Add In Structure
        this.elBtnAddInStructure = UI.Button.IconByType("Add");
        this.elHeader.appendChild(this.elBtnAddInStructure);

        // Number Of Things in Structure
        this.elNumberInStructure = UI.Paragraph.Text(this.appName);
        this.elHeader.appendChild(this.elNumberInStructure);

        // Button Add In Map
        this.elBtnAddInMap = UI.Button.IconByType("Add");
        this.elHeader.appendChild(this.elBtnAddInMap);

        // Number Of Things in Map
        this.elNumberInMap = UI.Paragraph.Text(this.appName);
        this.elHeader.appendChild(this.elNumberInMap);

        // Span
        this.elHeader.appendChild(UI.Div.Span());

        // Button Structure
        this.elBtnStructure = UI.Button.IconByType("Thing");
        this.elHeader.appendChild(this.elBtnStructure);

        // Button Map
        this.elBtnMap = UI.Button.IconByType("Map");
        this.elHeader.appendChild(this.elBtnMap);

        // Append Header To Body
        this.elBody.appendChild(this.elHeader);

        // Main
        this.elMain = UI.Div.Column();
        this.elMain.classList.add('scroll');
        this.elMain.style.marginLeft = this.left;
        this.elBody.appendChild(this.elMain);
    }

    //#region renderStructure
    renderStructure() {
        this.elBtnAddInStructure.classList.remove('hidden');
        this.elNumberInStructure.classList.remove('hidden');
        this.elBtnAddInMap.classList.add('hidden');
        this.elNumberInMap.classList.add('hidden');

        this.elNumberInStructure.textContent = this.data.getNumberOfChildren();
        this.elMain.innerHTML = "";
        this.data.root.children.forEach(child => {
            const elChild = this._ThingChild(this.data.root, child);
            this.elMain.appendChild(elChild);
        })
    }

    //#region _ThingChild
    _ThingChild(father, child) {

        const elCol = UI.Div.Column(this.classCol)

        // Input Name
        const elInputName = UI.Input.Text(child.name);
        elInputName.classList.add(this.className)
        elCol.appendChild(elInputName);

        // Child Button
        const elChildBtn = this._ThingIconRow(father, child);
        elCol.appendChild(elChildBtn);

        // Children
        if (child.open) {
            const listChildren = child.children;
            if  (listChildren.length > 0) {
                const elColChildren = UI.Div.Column(this.classChildren);
                elColChildren.style.marginLeft = this.left;
                listChildren.forEach(childOfChild => {
                    const elChild = this._ThingChild(child, childOfChild);
                    elColChildren.appendChild(elChild);
                })
                elCol.appendChild(elColChildren);
            }
        }

        // Change Name
        elInputName.addEventListener('change', (e) => {
            child.name = e.target.value;
            this.data.save();
        });
        
        return elCol;
    }

    //#region _ThingIconRow
    _ThingIconRow(father, child) {
        const classBtn = 'null';
        const elRow = UI.Div.Row('wrap');

        // Button Add Child
        const elBtnAdd = UI.Button.IconByType("Add");
        elBtnAdd.classList.add(classBtn);
        elRow.appendChild(elBtnAdd);

        // Number Children
        const number = child.getNumberOfChildren();
        elRow.appendChild(UI.Paragraph.Text(number));

        elRow.appendChild(UI.Paragraph.Text("|"));

        // Note
        const elBtnNote = UI.Button.IconByType("Note");
        if (child.note) elBtnNote.classList.add('have-note')
        elRow.appendChild(elBtnNote);

        elRow.appendChild(UI.Paragraph.Text("|"));

        // Btn Delete
        const elBtnDelete = UI.Button.IconByType("Delete");
        elRow.appendChild(elBtnDelete);

        // Move
        const elBtnMove = UI.Button.IconByType("Move");
        elBtnMove.classList.add(classBtn);
        elRow.appendChild(elBtnMove);

        // Select To Move
        const listMove = this.data.getListToMove(child);
        const elRowSelect = UI.Div.Row();
        elRowSelect.appendChild(UI.Paragraph.Text("To:"))
        const elSelectMove = UI.Input.Select(listMove);
        elRowSelect.appendChild(elSelectMove);
        elSelectMove.value = "";
        elRowSelect.classList.add('hidden');
        elRow.appendChild(elRowSelect);

        // Span
        elRow.appendChild(UI.Div.Span());

        // Button Show
        if (child.children.length > 0 ) {
            const valueShowHidden = child.open ? "Show" : "Hidden";
            const elBtnShowHidden = UI.Button.IconByType(valueShowHidden);
            elBtnShowHidden.classList.add(classBtn);
            elRow.appendChild(elBtnShowHidden);

            // Click ShowHidden
            elBtnShowHidden.addEventListener('click', () => {
                child.open = child.open ? false : true;
                this.data.save();
                this.renderStructure();
            });
        }

        // Click Add
        elBtnAdd.addEventListener('click', () => {
            child.add(new SuperThing());
            child.open = true;
            this.data.save();
            this.renderStructure();
        });

        // Click Note
        elBtnNote.addEventListener('click', () => {
            const elDialogContent = this._ThingDialog(child, "Note");
            this.elMain.appendChild(elDialogContent);
            elDialogContent.showModal();
        })

        // Click Move
        elBtnMove.addEventListener('click', () => {
            if (elRowSelect.classList.contains("hidden")) {
                elRowSelect.classList.remove('hidden');
            } else {
                elRowSelect.classList.add('hidden');
            }
        })

        // Select Move
        elSelectMove.addEventListener('change', (e) => {
            const newFatherID = e.target.value;
            this.data.move(child, newFatherID, father);
            this.data.save();
            this.renderStructure();
        })

        // Click Delete
        elBtnDelete.addEventListener('click', () => {
            father.delete(child);
            this.data.save();
            this.renderStructure();
        });
        return elRow;
    }

    //#region _ThingDialog
    _ThingDialog(obj, type) {
        const elDialog = document.createElement('dialog');

        // Content
        const elContent = UI.Div.Column();
        elContent.appendChild(UI.Paragraph.Label(type));

        let elInput;

        if (type === "Note") {
            // Text Area
            elInput = UI.Input.TextArea(obj.note || "",25);
            elContent.appendChild(elInput);
        }

        // Button
        const elBtn = UI.Div.Row()
        elBtn.style.marginTop = '1rem';

        // Btn Save
        const elBtnSave = UI.Button.Text("Save");
        elBtnSave.className = 'modal-btn';
        elBtn.appendChild(elBtnSave);

        // Btn Clear
        const elBtnClear = UI.Button.Text("Clear");
        elBtnClear.className = 'modal-btn';
        elBtn.appendChild(elBtnClear);

        // Btn Close
        const elBtnClose = UI.Button.Text("Close");
        elBtnClose.className = 'modal-btn';
        elBtn.appendChild(elBtnClose);

        elContent.appendChild(elBtn);

        // Click Save
        elBtnSave.addEventListener('click', () => {
            if (type === "Note") {
                obj.note = elInput.value;
            }
            this.data.save();
            elDialog.close();
            this.renderStructure();
        })
        
        // Click Clear
        elBtnClear.addEventListener('click', () => {
            if (type === "Note") {
                obj.note = "";
            }
            this.data.save();
            elDialog.close();
            this.renderStructure();
        })

        // Click Close
        elBtnClose.addEventListener('click', () => {
            elDialog.close();
        })

        elDialog.appendChild(elContent);
        return elDialog;
    }

    //#region renderMap
    renderMap() {
        this.elBtnAddInStructure.classList.add('hidden');
        this.elNumberInStructure.classList.add('hidden');
        this.elBtnStructure.classList.remove('hidden');
        this.elBtnAddInMap.classList.remove('hidden');
        this.elNumberInMap.classList.remove('hidden');
        this.elNumberInMap.textContent = this.data.getNumberOfChildren();

        this.elMain.innerHTML = ""
        this.data.root.children.forEach(child => {
            const elChild = this._ThingChildMap(this.data.root, child);
            this.elMain.appendChild(elChild);
        })
    }

    //#region _ThingChildMap
    _ThingChildMap(father, child) {

        const elRow = UI.Div.Row()
        if (father == this.data.root) elRow.classList.add("underline")
        // Content
        const elContent = UI.Div.Row("map-input")
        elRow.appendChild(elContent)

        // Input Name
        const elInputName = UI.Input.Text(child.name);
        elContent.appendChild(elInputName);

        // Note
        const elBtnNote = UI.Button.IconByType("Note");
        if (child.note) elBtnNote.classList.add('have-note')
        elContent.appendChild(elBtnNote);

        // Btn Delete
        const elBtnDelete = UI.Button.IconByType("Delete");
        elContent.appendChild(elBtnDelete);

        // Button Add Child
        const elBtnAdd = UI.Button.IconByType("Add");
        elRow.appendChild(elBtnAdd);

        // Children
        const listChildren = child.children;
        if  (listChildren.length > 0) {
            const elColChildren = UI.Div.Column("solid-alpha");
            elColChildren.style.marginLeft = this.left;
            listChildren.forEach(childOfChild => {
                const elChild = this._ThingChildMap(child, childOfChild);
                elColChildren.appendChild(elChild);
            })
            elRow.appendChild(elColChildren);
        }

        // Change Name
        elInputName.addEventListener('change', (e) => {
            child.name = e.target.value;
            this.data.save();
        });

        // Click Note
        elBtnNote.addEventListener('click', () => {
            const elDialogContent = this._ThingDialogMap(child, "Note");
            this.elMain.appendChild(elDialogContent);
            elDialogContent.showModal();
        })

        // Click Delete
        elBtnDelete.addEventListener('click', () => {
            father.delete(child);
            this.data.save();
            this.renderMap();
        });

        // Click Add
        elBtnAdd.addEventListener('click', () => {
            child.add(new SuperThing());
            child.open = true;
            this.data.save();
            this.renderMap();
        });

        return elRow;
    }

    //#region _ThingDialogMap
    _ThingDialogMap(obj, type) {
        const elDialog = document.createElement('dialog');

        // Content
        const elContent = UI.Div.Column();
        elContent.appendChild(UI.Paragraph.Label(type));

        let elInput;

        if (type === "Note") {
            // Text Area
            elInput = UI.Input.TextArea(obj.note || "", 5);
            elContent.appendChild(elInput);
        }

        // Button
        const elBtn = UI.Div.Row()
        elBtn.style.marginTop = '1rem';

        // Btn Save
        const elBtnSave = UI.Button.Text("Save");
        elBtnSave.className = 'modal-btn';
        elBtn.appendChild(elBtnSave);

        // Btn Clear
        const elBtnClear = UI.Button.Text("Clear");
        elBtnClear.className = 'modal-btn';
        elBtn.appendChild(elBtnClear);

        // Btn Close
        const elBtnClose = UI.Button.Text("Close");
        elBtnClose.className = 'modal-btn';
        elBtn.appendChild(elBtnClose);

        elContent.appendChild(elBtn);

        // Click Save
        elBtnSave.addEventListener('click', () => {
            if (type === "Note") {
                obj.note = elInput.value;
            }
            this.data.save();
            elDialog.close();
            this.renderMap();
        })
        
        // Click Clear
        elBtnClear.addEventListener('click', () => {
            if (type === "Note") {
                obj.note = "";
            }
            this.data.save();
            elDialog.close();
            this.renderMap();
        })

        // Click Close
        elBtnClose.addEventListener('click', () => {
            elDialog.close();
        })

        elDialog.appendChild(elContent);
        return elDialog;
    }


    //#region listen
    listen(){
        // Add Thing
        this.elBtnAddInStructure.addEventListener('click', () => {
            this.data.add(new SuperThing());
            this.data.save();
            this.renderStructure();
        });

        // Add Thing
        this.elBtnAddInMap.addEventListener('click', () => {
            this.data.add(new SuperThing());
            this.data.save();
            this.renderMap();
        });

        // Show Map
        this.elBtnMap.addEventListener('click', () => {
            this.renderMap();
        });


        // Back Thing
        this.elBtnStructure.addEventListener('click', () => {
            this.renderStructure();
        });

        // Export Json
        this.elBtnExport.addEventListener('click', () => {
            const stringData = this.data.exportJson();
            const blob = new Blob([stringData], { type: "application/json"});
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            const today = Helper.datetimeToString(new Date())
            a.download = `super-thing-${today}.json`;
            a.click();

            URL.revokeObjectURL(url);
        });

        // Import Json
        this.elBtnImport.addEventListener('click', () => {
            this.elFileImport.click();
            this.elFileImport.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        const newData = JSON.parse(event.target.result);
                        this.data.importJson(newData);
                        this.renderStructure();
                    } catch (err) {
                        alert("Wrong File");
                    }
                };
                reader.readAsText(file);
            });
        });

        // Clear
        this.elBtnClear.addEventListener('click', () => {
            this.data.clear();
            this.renderStructure();
        });

    }
}

//#region DOM
document.addEventListener("DOMContentLoaded", () => {
    const app = new App({
        elBody:document.getElementById('body'), 
        data: dataTemp,
        appName: "Super Things"
    })
    app.renderStructure();
    app.listen();
})