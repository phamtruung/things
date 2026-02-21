//#region SuperThing
class SuperThing {
    constructor({id=Helper.UUID(), name="New Thing"} = {}) {
        this.id = id;
        this.name = name;
        this.children = []
    }
    add(thing) {
        if (thing instanceof SuperThing) {
            this.children.push(thing)
        }
    }
    delete(thing) {
        if (thing instanceof SuperThing) {
            const newChildren = this.children.filter(exitObj => exitObj!== thing);
            this.children = newChildren;
        }
    }
    findAndDelete(thing) {
        this.delete(thing);
        if (this.children.length) {
            this.children.forEach(child => child.findAndDelete(thing));
        }
    }
    getListOfChildren() {
        let output = [];
        this.children.forEach(obj => {
            output.push(obj);
            output.push(...obj.getListOfChildren());
        });
        return output;
    }
    getListToMove(existObj) {
        let output = [];
        this.children.forEach(obj => {
            if (obj != existObj) {
                output.push(obj);
                output.push(...obj.getListToMove(existObj));
            }
        })
        return output;
    }
    getNumberOfChildren() {
        return this.getListOfChildren().length;
    }
    static map(obj) {
        const superThing = new SuperThing(obj);
        if (obj.datetime) superThing.datetime = Helper.datetimeToString(obj.datetime);
        if (obj.note) superThing.note = String(obj.note);
        if (obj.open) superThing.open = Boolean(obj.open);
        if (obj.children.length) {
            obj.children.forEach(child => {
                const childThing = this.map(child);
                superThing.add(childThing);
            })
        }
        return superThing;
    }
}


//#region Data
class Data {
    constructor() {
        this.root = new SuperThing({ name: "---Root---" });
    }
    add(thing) {
        if (thing instanceof SuperThing) {
            this.root.add(thing)
        }
    }
    delete(thing) {
        if (thing instanceof SuperThing) {
            this.root.delete(thing)
        }
    }
    findAndDelete(thing) {
        this.root.findAndDelete(thing);
    }
    move(existThing, newFatherID, oldFather) {
        const listAll = this.getListOfChildren();
        const newFather = listAll.find(obj => obj.id === newFatherID);
        if (oldFather instanceof SuperThing && newFather instanceof SuperThing) {
            oldFather.delete(existThing);
            newFather.add(existThing);
            newFather.open = true;
        }
    }
    getListOfChildren() {
        let output = [this.root];
        output.push(...this.root.getListOfChildren());
        return output;
    }
    getListToMove(existThing) {
        let output = [this.root];
        output.push(...this.root.getListToMove(existThing));
        return output;
    }
    getNumberOfChildren() {
        return this.root.getNumberOfChildren();
    }
    getListThingsHaveTime() {
        const listThing = this.getListOfChildren();
        return listThing.filter(thing => thing.datetime != undefined)
    }
    //#region DefaultData
    createDefaultData() {
        // --------------------------------------- Temp
        const temp = new SuperThing({ name: "Temp"});
        temp.add(new SuperThing({ name: "Do Some Thing"}));

        // --------------------------------------- Work
        const work = new SuperThing({ name: "Work"});
        const code = new SuperThing({ name: "Code Super Thing" });
        work.add(code);
        
        // --------------------------------------- Relax
        const relax = new SuperThing({ name: "Relax"});
        relax.add(new SuperThing({ name: "Movie"}));

        // --------------------------------------- Root
        this.add(temp);
        this.add(work);
        this.add(relax);
    }
    //#region DataAction
    exportJson() {
        const string = JSON.stringify(this, null, 2)
        return string;
    }
    importJson(obj) {
        this.root = SuperThing.map(obj.root);
        this.save();
    }
    save() {
        const appName = "super-things";
        const jsonString = this.exportJson();
        localStorage.setItem(appName, jsonString)
    }
    clear() {
        this.root = new SuperThing({ name: "---Root---" });
    }
    load() {
        const appName = "super-things";
        const raw = localStorage.getItem(appName);
        if (raw) {

            try {
                const object = JSON.parse(raw);
                this.importJson(object);
            } catch {
                this.createDefaultData();

            }
        } else {
            this.createDefaultData();
        }
    }
}

//#region Load
const dataTemp = new Data();
document.addEventListener("DOMContentLoaded", () => {
    dataTemp.load();
})