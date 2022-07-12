import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "math";
var name = "The Math!";
var description = "Nice math latex.";
var authors = "Throngjwk";
var version = "1.0.0";

var currency, currency2;
var aPow;


var init = () => {
    currency = theory.createCurrency("n", "n");
    currency2 = theory.createCurrency("t", "t");

    var achievements = new Array(7)

    /**
     * Achievement Name Get to names.
     */
    const achievement_name = [
        "You Played!",
        "One A-Power Rewitten",
        "Hundred N",
        "Five A-Power",
        "Something Public?",
        "One A-Factor",
        "Two A-Factor",
        "Go Spent!",
    ]
    /**
     * Achievemnet Description for Constant
     */

    const achievement_description = [
        "Make n(t) => 1",
        "Reach 1 Apow",
        "Make n(t) => 100",
        "Reach 5 Apow",
        "Make n(t) => 100,000",
        "Reach 1 Afac",
        "Reach 2 Afac",
        "Make n(t) => 10,000,000",
    ]

    

    ///////////////////
    // Regular Upgrades

    // aPow
    {
        let getDesc = (level) => "A_1=" + getAPow(level).toString(0);
        aPow = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(15, Math.log2(2.75))));
        aPow.getDescription = (_) => Utils.getMath(getDesc(aPow.level));
        aPow.getInfo = (amount) => Utils.getMathTo(getDesc(aPow.level), getDesc(aPow.level + amount));
    }

    // aFactor
    {
        let getDesc = (level) => "A_2=" + getAFac(level).toString(0);
        aFactor = theory.createUpgrade(1, currency, new FirstFreeCost(new ExponentialCost(1e5, Math.log2(10))));
        aFactor.getDescription = (_) => Utils.getMath(getDesc(aFactor.level));
        aFactor.getInfo = (amount) => Utils.getMathTo(getDesc(aFactor.level), getDesc(aFactor.level + amount));
    }

    // aFactor2
    {
        let getDesc = (level) => "A_3=" + getAFac2(level).toString(0);
        aFactor2 = theory.createUpgrade(2, currency, new FirstFreeCost(new ExponentialCost(1e12, Math.log2(20))));
        aFactor2.getDescription = (_) => Utils.getMath(getDesc(aFactor2.level));
        aFactor2.getInfo = (amount) => Utils.getMathTo(getDesc(aFactor2.level), getDesc(aFactor2.level + amount));
    }

    // bPow
    {
        let getDesc = (level) => "B_1=" + getBPow(level).toString(0);
        bPow = theory.createUpgrade(3, currency, new FirstFreeCost(new ExponentialCost(1e20, Math.log2(32768))));
        bPow.getDescription = (_) => Utils.getMath(getDesc(bPow.level));
        bPow.getInfo = (amount) => Utils.getMathTo(getDesc(bPow.level), getDesc(bPow.level + amount));
    }

    // battery
    {
        battery = theory.createUpgrade(4, currency, new FreeCost());
        battery.getDescription = (_) => "Open Battery Menu";
        battery.getInfo = (amount) => "Open Battery Menu";
        battery.boughtOrRefunded = (_) => {
            popup.show();
            battery.level = 0;
        }
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e5);
    theory.createBuyAllUpgrade(1, currency, 1e10);
    theory.createAutoBuyerUpgrade(2, currency, 1e20);

    //Achievements Booleans
     /**
     * Get Boolean Each Unlocked.
     */
    const achievement_boolean = [
        currency.value > 1,
        aPow.level > 0,
        currency.value > 100,
        aPow.level > 4,
        currency.value > 1e5,
        aFactor.level > 0,
        aFactor.level > 1,
        currency.value > 1e7,
    ]
    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(2, 1));
    
    {
        aFacTerm = theory.createMilestoneUpgrade(0, 1);
        aFacTerm.description = "Unlock new term for $A_2$";
        aFacTerm.info = "Unlock new term for $A_2$";
        aFacTerm.boughtOrRefunded = (_) => {
            updateAvailability();
             theory.invalidatePrimaryEquation();
        };
    }

    {
        tLol = theory.createMilestoneUpgrade(1, 1);
        tLol.description = Localization.getUpgradeIncCustomExpDesc("t", "1");
        tLol.info = Localization.getUpgradeIncCustomExpInfo("t", "1");
        tLol.boughtOrRefunded = (_) => {
            updateAvailability();
             theory.invalidatePrimaryEquation();
        };
    }

    {
        aFacTerm2 = theory.createMilestoneUpgrade(2, 1);
        aFacTerm2.description = "Unlock new term for $A_3$";
        aFacTerm2.info = "Unlock new term for $A_3$";
        aFacTerm.boughtOrRefunded = (_) => {
            updateAvailability();
             theory.invalidatePrimaryEquation();
        };
    }

    {
        a2Exp = theory.createMilestoneUpgrade(3, 1);
        a2Exp.description = Localization.getUpgradeIncCustomExpDesc("A_2", "0.2");
        a2Exp.info = Localization.getUpgradeIncCustomExpInfo("A_2", "0.2");
        a2Exp.boughtOrRefunded = (_) => {
            updateAvailability();
             theory.invalidatePrimaryEquation();
        };
    }

    {
        bPowTerm = theory.createMilestoneUpgrade(4, 1);
        bPowTerm.description = "Unlock new term for $B_1$";
        bPowTerm.info = "Unlock new term for $B_1$";
        bPowTerm.boughtOrRefunded = (_) => {
            updateAvailability();
             theory.invalidatePrimaryEquation();
        };
    }

    {
        a3Exp = theory.createMilestoneUpgrade(5, 12);
        a3Exp.description = Localization.getUpgradeIncCustomExpDesc("A_3", "0.05");
        a3Exp.info = Localization.getUpgradeIncCustomExpInfo("A_3", "0.05");
        a3Exp.boughtOrRefunded = (_) => {
            updateAvailability();
             theory.invalidatePrimaryEquation();
        };
    }

    {
        batteryUnlocked = theory.createMilestoneUpgrade(6, 1);
        batteryUnlocked.description = "Unlock Batteries From B-Power";
        batteryUnlocked.info = "Unlock Batteries From B-Power";
        batteryUnlocked.boughtOrRefunded = (_) => {
            updateAvailability();
             theory.invalidatePrimaryEquation();
        };
    }

    /////////////////
    //// Achievements
    //All 7 Achievements
    for (let i = 0; i < 7; i++) {
        achievements[i] = theory.createAchievement(i, achievement_name[i], achievement_description[i], () => achievement_boolean[i])
    }

    ///////////////////
    //// Story chapters

    updateAvailability();

    //POPUPS

    function createButtonSpecial(name, column, row, clicked, isUnlocked) {
        ui.createButton({
            text: name,
            row: row,
            column: column,
            onClicked:() => {
                if (isUnlocked) {
                    clicked
                }
            }
        })
    }

    let basicLockedAva1 = bPow.level > 4

    let basicEffect1 = () => {
        if (basicLockedAva1) {
            return getAPow(aPow.level) * 2
        } else {
            return BigNumber.ONE
        }
    }

    let basicLocked1 = () => {
        if (basicLockedAva1) {
            return "Unlocked"
        } else {
            return "Locked"
        }
    }

    let basicLockedAva2 = bPow.level > 4

    let basicLockedAva3 = bPow.level > 5

    let basicLockedAva4 = bPow.level > 7

    let basicEffect2 = () => {
        if (basicLockedAva2) {
            return getAFac(aFactor.level) * 2
        } else {
            return BigNumber.ONE
        }
    }

    let basicEffect3 = () => {
        if (basicLockedAva2) {
            return getAFac(aFactor.level) * 2
        } else {
            return BigNumber.ONE
        }
    }

    let basicEffect4 = () => {
        if (basicLockedAva1) {
            return getAPow(aPow.level) * 2
        } else {
            return BigNumber.ONE
        }
    }

    let basicLocked2 = () => {
        if (basicLockedAva2) {
            return "Unlocked"
        } else {
            return "Locked"
        }
    }

    let basicLocked3 = () => {
        if (basicLockedAva3) {
            return "Unlocked"
        } else {
            return "Locked"
        }
    }

    let basicLocked4 = () => {
        if (basicLockedAva4) {
            return "Unlocked"
        } else {
            return "Locked"
        }
    }

    var battery1 = ui.createPopup({
        title: "Battery 1",
        content: ui.createStackLayout({
            children: [
                ui.createFrame({
                    heightRequest: 50,
                    cornerRadius: 10,
                    content: ui.createLabel({
                        text: "Currently:" + basicLocked1 + " | Currently:" + basicEffect1,
                        horizontalOptions: LayoutOptions.CENTER,
                        verticalOptions: LayoutOptions.CENTER
                    })
                }),
                ui.createLabel({text: "Effect:"}),
                ui.createLatexLabel({text: "EFFECT IS MULITIPLER $A_1 \\times 2$ INSTANCES."}),
                ui.createButton({text: "Close", onClicked: () => popup.hide()})
            ]
        })
    });

    var battery2 = ui.createPopup({
        title: "Battery 2",
        content: ui.createStackLayout({
            children: [
                ui.createFrame({
                    heightRequest: 50,
                    cornerRadius: 10,
                    content: ui.createLabel({
                        text: "Currently:" + basicLocked2 + " | Currently:" + basicEffect2,
                        horizontalOptions: LayoutOptions.CENTER,
                        verticalOptions: LayoutOptions.CENTER
                    })
                }),
                ui.createLabel({text: "Effect:"}),
                ui.createLatexLabel({text: "EFFECT IS MULITIPLER $A_2 \\times 2$ INSTANCES."}),
                ui.createButton({text: "Close", onClicked: () => popup.hide()})
            ]
        })
    });

    var battery3 = ui.createPopup({
        title: "Battery 3",
        content: ui.createStackLayout({
            children: [
                ui.createFrame({
                    heightRequest: 50,
                    cornerRadius: 10,
                    content: ui.createLabel({
                        text: "Currently:" + basicLocked3 + " | Currently:" + basicEffect3,
                        horizontalOptions: LayoutOptions.CENTER,
                        verticalOptions: LayoutOptions.CENTER
                    })
                }),
                ui.createLabel({text: "Effect:"}),
                ui.createLatexLabel({text: "EFFECT IS MULITIPLER $A_2 \\times 2$ INSTANCES."}),
                ui.createButton({text: "Close", onClicked: () => popup.hide()})
            ]
        })
    });

    var battery4 = ui.createPopup({
        title: "Battery 4",
        content: ui.createStackLayout({
            children: [
                ui.createFrame({
                    heightRequest: 50,
                    cornerRadius: 10,
                    content: ui.createLabel({
                        text: "Currently:" + basicLocked4 + " | Currently:" + basicEffect4,
                        horizontalOptions: LayoutOptions.CENTER,
                        verticalOptions: LayoutOptions.CENTER
                    })
                }),
                ui.createLabel({text: "Effect:"}),
                ui.createLatexLabel({text: "EFFECT IS MULITIPLER $A_2 \\times 2$ INSTANCES."}),
                ui.createButton({text: "Close", onClicked: () => popup.hide()})
            ]
        })
    });

    var popup = ui.createPopup({
        title: "Batteries",
        content: ui.createStackLayout({
            children: [
                ui.createFrame({
                    heightRequest: 50,
                    cornerRadius: 10,
                    content: ui.createLabel({
                        text: "Batteries Unlock from B-Power level.",
                        horizontalOptions: LayoutOptions.CENTER,
                        verticalOptions: LayoutOptions.CENTER
                    })
                }),
                ui.createLabel({text: "I showse batteries now."}),
                ui.createButton({text: "Close", onClicked: () => popup.hide()})
            ]
        })
    });

    battery1 = ui.createPopup({
        title: "Battery 1",
        content: ui.createStackLayout({
            children: [
                ui.createFrame({
                    heightRequest: 50,
                    cornerRadius: 10,
                    content: ui.createLabel({
                        text: "Currently:" + basicLocked1 + " | Currently:" + basicEffect1,
                        horizontalOptions: LayoutOptions.CENTER,
                        verticalOptions: LayoutOptions.CENTER
                    })
                }),
                ui.createLabel({text: "Effect:"}),
                ui.createLatexLabel({text: "EFFECT IS MULITIPLER $A_1 \\times 2$ INSTANCES."}),
                ui.createButton({text: "Close", onClicked: () => popup.hide()})
            ]
        })
    });

     battery2 = ui.createPopup({
        title: "Battery 2",
        content: ui.createStackLayout({
            children: [
                ui.createFrame({
                    heightRequest: 50,
                    cornerRadius: 10,
                    content: ui.createLabel({
                        text: "Currently:" + basicLocked2 + " | Currently:" + basicEffect2,
                        horizontalOptions: LayoutOptions.CENTER,
                        verticalOptions: LayoutOptions.CENTER
                    })
                }),
                ui.createLabel({text: "Effect:"}),
                ui.createLatexLabel({text: "EFFECT IS MULITIPLER $A_2 \\times 2$ INSTANCES."}),
                ui.createButton({text: "Close", onClicked: () => popup.hide()})
            ]
        })
    });

    battery3 = ui.createPopup({
        title: "Battery 3",
        content: ui.createStackLayout({
            children: [
                ui.createFrame({
                    heightRequest: 50,
                    cornerRadius: 10,
                    content: ui.createLabel({
                        text: "Currently:" + basicLocked3 + " | Currently:" + basicEffect3,
                        horizontalOptions: LayoutOptions.CENTER,
                        verticalOptions: LayoutOptions.CENTER
                    })
                }),
                ui.createLabel({text: "Effect:"}),
                ui.createLatexLabel({text: "EFFECT IS MULITIPLER $A_2 \\times 2$ INSTANCES."}),
                ui.createButton({text: "Close", onClicked: () => popup.hide()})
            ]
        })
    });

    battery4 = ui.createPopup({
        title: "Battery 4",
        content: ui.createStackLayout({
            children: [
                ui.createFrame({
                    heightRequest: 50,
                    cornerRadius: 10,
                    content: ui.createLabel({
                        text: "Currently:" + basicLocked4 + " | Currently:" + basicEffect4,
                        horizontalOptions: LayoutOptions.CENTER,
                        verticalOptions: LayoutOptions.CENTER
                    })
                }),
                ui.createLabel({text: "Effect:"}),
                ui.createLatexLabel({text: "EFFECT IS MULITIPLER $A_1 \\times 2$ INSTANCES."}),
                ui.createButton({text: "Close", onClicked: () => popup.hide()})
            ]
        })
    });
}

var updateAvailability = () => {
    aFactor.isAvailable = aFacTerm.level > 0
    tLol.isAvailable = aFacTerm.level > 0
    aFacTerm2.isAvailable = tLol.level > 0
    aFactor2.isAvailable = aFacTerm2.level > 0
    bPowTerm.isAvailable = aFacTerm2.level > 0
    bPow.isAvailable = bPowTerm.level > 0
    a3Exp.isAvailable = bPowTerm.level > 0
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency2.value += dt
    currency.value += dt * bonus * currency2.value.pow(getTExponent(tLol.level)) * getAPow(aPow.level).pow(2) * getAFac(aFactor.level).pow(getA2Exponent(a2Exp.level)) * getAFac2(aFactor2.level).pow(getA3Exponent(a3Exp.level)) * BigNumber.THREE.pow(getBPow(bPow.level))
    basicLockedAva1 = bPow.level > 4
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = t";

    if (tLol.level == 1) result += "^2";

    result += " \\times A_1^2";

    if (aFacTerm.level == 1) result += " \\times A_2";

    if (a2Exp.level == 1) result += "^{1.2}";

    if (aFacTerm2.level == 1) result += " \\times A_3";

    if (a3Exp.level == 1) result += "^{1.05}";
    if (a3Exp.level == 2) result += "^{1.1}";
    if (a3Exp.level == 3) result += "^{1.15}";
    if (a3Exp.level == 4) result += "^{1.2}";
    if (a3Exp.level == 5) result += "^{1.25}";
    if (a3Exp.level == 6) result += "^{1.3}";
    if (a3Exp.level == 7) result += "^{1.35}";
    if (a3Exp.level == 8) result += "^{1.4}";
    if (a3Exp.level == 9) result += "^{1.45}";
    if (a3Exp.level == 10) result += "^{1.5}";
    if (a3Exp.level == 11) result += "^{1.55}";
    if (a3Exp.level == 12) result += "^{1.6}";

    if (bPowTerm.level == 1) result += " \\times 3^{B_1}";

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho^{0.4}";
var getPublicationMultiplier = (tau) => tau.pow(0.521) / BigNumber.from(25).sqrt();
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.521}}{\\sqrt{25}}";
var getTau = () => currency.value.pow(0.4);
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getAPow = (level) => BigNumber.from(level)
var getAFac = (level) => BigNumber.from(1 + 2 * level)
var getAFac2 = (level) => BigNumber.from(1 + 2 * level)
var getBPow = (level) => BigNumber.from(level)
var getTExponent = (level) => BigNumber.from(1 + level)
var getA2Exponent = (level) => BigNumber.from(1 + 0.2 * level)
var getA3Exponent = (level) => BigNumber.from(1 + 0.05 * level)


init();
