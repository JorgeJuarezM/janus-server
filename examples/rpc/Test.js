module.exports = (function () {
    function F() {

    }

    F.prototype.Create = function () {
        console.log(this);
    };

    return F;
})();