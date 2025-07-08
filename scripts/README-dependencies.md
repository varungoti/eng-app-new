# Dependency Management Scripts

This directory contains scripts to help manage dependencies and fix compatibility issues.

## Available Scripts

### Check Dependencies

The `check-dependencies.js` script checks for package compatibility issues by analyzing the installed packages and comparing them with the versions specified in package.json.

```bash
npm run check-deps
```

This script will:
1. Get the list of installed packages
2. Get the list of packages from package.json
3. Compare the versions
4. Display any compatibility issues

### Fix Dependencies

The `fix-dependencies.js` script helps fix dependency compatibility issues by cleaning the node_modules directory and reinstalling packages with the correct versions.

```bash
npm run fix-deps
```

This script will:
1. Remove the node_modules directory
2. Remove package-lock.json
3. Clean the npm cache
4. Reinstall dependencies with the `--legacy-peer-deps` and `--force` flags

### Aggressive Fix Dependencies

If the regular fix script doesn't work, you can use the aggressive fix script which tries harder to resolve compatibility issues:

```bash
npm run fix-deps-aggressive
```

This script will:
1. Remove the node_modules directory
2. Remove package-lock.json
3. Clean the npm cache
4. Try to install all dependencies at once with `--legacy-peer-deps`, `--force`, and `--no-package-lock` flags
5. If that fails, install each package one by one

### Add Dependency

The `add-dependency.js` script helps add new dependencies safely by checking compatibility with existing packages and installing with the appropriate flags.

```bash
npm run add-dep
```

This script will:
1. Ask for the package name and version
2. Check available versions for the package
3. Ask if it's a dev dependency
4. Install the package with `--legacy-peer-deps` and `--save-exact` flags
5. If that fails, try with `--force`

## Common Issues and Solutions

### Version Mismatches

If you see errors like:

```
npm error invalid: @tiptap/extension-font-size@3.0.0-next.3 C:\Users\varun\eng-app-new\node_modules\@tiptap\extension-font-size
```

This means that the installed version of a package doesn't match the version specified in package.json. Run `npm run fix-deps` to fix this issue.

### Extraneous Packages

If you see errors like:

```
npm error extraneous: vite-plugin-react@1.1.2 C:\Users\varun\eng-app-new\node_modules\vite-plugin-react
```

This means that a package is installed but not listed in package.json. Run `npm run fix-deps` to fix this issue.

### Peer Dependency Issues

If you see warnings about peer dependencies, run `npm run fix-deps` which uses the `--legacy-peer-deps` flag to ignore peer dependency issues.

## Best Practices

1. Always run `npm run check-deps` before starting development to ensure your dependencies are in sync
2. If you encounter any dependency issues, run `npm run fix-deps` to fix them
3. If `npm run fix-deps` doesn't work, try `npm run fix-deps-aggressive`
4. After updating package.json, run `npm run fix-deps` to ensure all dependencies are installed correctly
5. Use exact versions (without ^ or ~) in package.json to avoid compatibility issues
6. When adding new dependencies, use `npm run add-dep` instead of `npm install`
7. If you encounter specific version issues, check the available versions with `npm view <package-name> versions --json`
8. Regularly run `npm run check-deps` to catch compatibility issues early
