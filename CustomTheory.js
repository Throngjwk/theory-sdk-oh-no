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

    var achievements = new Array(5)

    /**
     * Achievement Name Get to names.
     */
    const achievement_name = [
        "You Played!",
        "One A-Power Rewitten",
        "Hundred N",
        "Five A-Power",
        "Something Public?"
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
    ]

    /**
     * Get Boolean Each Unlocked.
     */
    const achievement_boolean = [
        n.value > 1,
        aPow.level > 0,
        n.value > 100,
        aPow.level > 4,
        n.value > 1e5,
        aFactor.level > 0,
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

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e5);
    theory.createBuyAllUpgrade(1, currency, 1e10);
    theory.createAutoBuyerUpgrade(2, currency, 1e20);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(25, 25));
    
    /////////////////
    //// Achievements
    //All 
    for (let i = 0; i < 5; i++) {
        achievements[i] = theory.createAchievement(i, achievement_name, achievement_description, () => c1.level > 1)
    }

    ///////////////////
    //// Story chapters

    updateAvailability();
}

var updateAvailability = () => {
    //cool
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency2.value += dt
    currency.value += dt * bonus * currency2.value * getAPow(aPow.level).pow(2)
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = t";

    result += " \\times A^2";

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";
var getPublicationMultiplier = (tau) => tau.pow(0.521) / BigNumber.THREE.sqrt();
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.521}}{\\sqrt{3}}";
var getTau = () => currency.value.pow(0.4);
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getAPow = (level) => BigNumber.from(level)

init();
