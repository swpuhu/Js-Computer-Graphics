function classDecorator<T extends { new (...args: any[]): {} }>(
    constructor: T
) {
    return class a {
        constructor(b: string) {}
    };
}

function overrideFunction(fn: Function) {
    return function (
        target,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        descriptor.value = fn;
    };
}

function override(f) {
    return function (target, propertyKey, descriptor: PropertyDescriptor) {
        return {
            value: f,
            configurable: false,
            enumerable: false,
            writable: false,
        };
    };
}

function propertyDec(target, propertyKey) {
    console.log(target);
    console.log(propertyKey);
}
class Greeter {
    property = "property";

    static staticProperty = "static";
    constructor() {}

    @override(function () {
        console.log("another function");
    })
    hello() {
        console.log(this.property);
    }
}

const t = new Greeter();
t.hello();
