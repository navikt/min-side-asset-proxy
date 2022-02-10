module.exports = (fullPackageName) => {
    const fragments = fullPackageName.split('/');
    const packageIsScoped = fragments.length === 2;

    const scope = packageIsScoped ? fragments[0] : null;
    const name = packageIsScoped ? fragments[1] : fragments[0];

    return [scope, name];
};
