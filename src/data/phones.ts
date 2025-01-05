import { Phone } from "@/types/phone";

const Phones: Phone[] = [
    {
        id: "1",
        name: "Iphone 16 ProMax",
        svg: "/phones/iPhone 16 Pro Max-290x610.svg",
        width: 296.21,
        height: 615.2,
        model3d: "https://cdn.sanity.io/files/w806qqoi/production/001058fa28be455585f7a08e0a8a1cca5f49b5d9.glb",
        case: [
            {
                id: "1",
                image: "https://cdn.sanity.io/images/w806qqoi/production/e22ec2f6e6ac3349368f55e97fa757ce69e6168e-485x485.png",
                model3d: "https://cdn.sanity.io/files/w806qqoi/production/510f183bd00a1841d9823453b995de494ecff50b.glb",
                title: "Clear case",
                price: 20,
                type: ""
            },
            {
                id: "2",
                image: "https://cdn.sanity.io/images/w806qqoi/production/4e70ca5dd0acc977b5bd8eb9901d4612734fdd60-485x485.png",
                model3d: "https://cdn.sanity.io/files/w806qqoi/production/8e985a9f47119456e18abf5cfad2e91b760b5b62.glb",
                title: "Mirror case",
                price: 26,
                type: "magsafe"
                
            }
        ]
    },
    {
        id: "2",
        name: "Iphone 16 Pro",
        svg: "/phones/iPhone 16 Pro-267x562.svg",
        width: 273.1,
        height: 565.5,
        model3d: "https://cdn.sanity.io/files/w806qqoi/production/77d8fc9d49b25764e168679c36a042022e2f8a84.glb",
        case: [
            {
                id: "1",
                image: "https://cdn.sanity.io/images/w806qqoi/production/e22ec2f6e6ac3349368f55e97fa757ce69e6168e-485x485.png",
                model3d: "https://cdn.sanity.io/files/w806qqoi/production/d6459ef3438ffcd2e95628bc0da616ef8e25156c.glb",
                title: "Clear case",
                price: 20,
                type: ""
            },
            {
                id: "2",
                image: "https://cdn.sanity.io/images/w806qqoi/production/4e70ca5dd0acc977b5bd8eb9901d4612734fdd60-485x485.png",
                model3d: "https://cdn.sanity.io/files/w806qqoi/production/35097e436adfa736d65c345a1354b8f2e08b3299.glb",
                title: "Mirror case",
                price: 26,
                type: "magsafe"
                
            }
        ]
    }
];
export default Phones;