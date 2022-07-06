import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "my_custom_theory_id";
var name = "My Custom Theory";
var description = "A basic theory.";
var authors = "Gilles-Philippe Paillé";
var version = 1;

var currency;
var Math1 = ["a_1", "a_2", "a_3", "a_4", "a_5", "a_6", "a_7", "a_8"]
var cost = [
    20,
    300,
    4000,
    50000,
    6e5,
    7e6,
    8e7,
    9e8,
]
var array = new Array(8)

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // All 8 A Vars

    for (let i = 0; i < 8; i++) {
        {
            let getDesc = (level) => "q_{" + i + "}" + getC1(level).toString(0);
            c1 = theory.createUpgrade(i, currency, new FirstFreeCost(new ExponentialCost(15, Math.log2(2))));
            c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
            c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));
        }
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(25, 25));

    
    /////////////////
    //// Achievements

    ///////////////////
    //// Story chapters

    updateAvailability();
}

var updateAvailability = () => {
    //
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency.value += dt * bonus * getC1(c1.level).pow(getC1Exponent(c1Exp.level)) *
                                   getC2(c2.level).pow(getC2Exponent(c2Exp.level));
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = c_1";

    result += "c_2";

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";
var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getC2 = (level) => BigNumber.TWO.pow(level);
var getC1Exponent = (level) => BigNumber.from(1 + 0.05 * level);
var getC2Exponent = (level) => BigNumber.from(1 + 0.05 * level);

init();
