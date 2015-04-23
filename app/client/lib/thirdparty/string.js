String.prototype.between = function (left, right) {
    var s = this;
    var startPos = s.indexOf(left);
    var endPos = s.indexOf(right, startPos + left.length);
    if (endPos == -1 && right != null)
        return new this.constructor('')
    else if (endPos == -1 && right == null)
        return s.substring(startPos + left.length);
    else
        return s.slice(startPos + left.length, endPos);
};

String.prototype.collapseWhitespace = function() {
  var s = this.replace(/[\s\xa0]+/g, ' ').replace(/^\s+|\s+$/g, '');
  return s;
};

String.prototype.hasNumbers = function()
{
    var regex = /\d/g;
    return regex.test(this);
};