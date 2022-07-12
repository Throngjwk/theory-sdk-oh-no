import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "44038";
var name = "Greek Simulator";
var description = "cool";
var authors = "Throngjwk";
var version = 1;

var currency;
var a, b, y;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // a
    {
        let getDesc = (level) => "\\alpha=" + getA(level).toString(0);
        a = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(5, Math.log2(3))));
        a.getDescription = (_) => Utils.getMath(getDesc(a.level));
        a.getInfo = (amount) => Utils.getMathTo(getDesc(a.level), getDesc(a.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e30);
    theory.createBuyAllUpgrade(1, currency, 1e63);
    theory.createAutoBuyerUpgrade(2, currency, 1e100);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(30, 5));

    {
        aExp = theory.createMilestoneUpgrade(0, 3);
        aExp.description = Localization.getUpgradeIncCustomExpDesc("\\alpha", "0.05");
        aExp.info = Localization.getUpgradeIncCustomExpInfo("\\alpha", "0.05");
        aExp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    /////////////////
    //// Achievements

    ///////////////////
    //// Story chapters

    updateAvailability();
}

var updateAvailability = () => {
    
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency.value += dt * bonus * getA(a.level)
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = \\prod_{i=\\beta}^{3}(\\frac{\\gamma}{2} \\times i)";

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";
var getPublicationMultiplier = (tau) => tau.pow(0.096) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.096}}{3}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getA = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);

init();
