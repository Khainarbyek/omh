import { Phone } from "@/types/phone";

const Phones: Phone[] = [
    {
        id: "1",
        name: "Iphone 16 ProMax",
        svg: "/phones/iPhone 16 Pro Max-290x610.svg",
        width: 290,
        height: 610,
        model3d: "/models/iphone/iphone 16 proMax.glb",
        case: [
            {
                id: "1",
                image: "/images/clear-case-485x485.png",
                model3d: "/models/iphone-clear-case/IP16ProMax-3.glb",
                title: "Clear case",
                price: 20,
                type: ""
            },
            {
                id: "2",
                image: "/images/mirror-case-485x485.png",
                model3d: "/models/iphone-mirror-case/Iphone16  ProMax.glb",
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
        width: 267,
        height: 562,
        model3d: "/models/iphone/iphone 16 pro.glb",
        case: [
            {
                id: "1",
                image: "/images/clear-case-485x485.png",
                model3d: "/models/iphone-clear-case/Ip16Pro.glb",
                title: "Clear case",
                price: 20,
                type: ""
            },
            {
                id: "2",
                image: "/images/mirror-case-485x485.png",
                model3d: "/models/iphone-mirror-case/Iphone16 Pro.glb",
                title: "Mirror case",
                price: 26,
                type: "magsafe"
                
            }
        ]
    }
];
export default Phones;