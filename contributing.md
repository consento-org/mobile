# Consento Mobile App - Development Workflow

TODO: Cleanup and add as documentation to github.com/consento-org/mobile 


## Prerequisites to contribute to code

- Get a Git client (we recommend [Sourcetree](https://www.sourcetreeapp.com/))
- Enable `allow force push` in the `SourceTree` > `Preferences` > `Advanced` 

<media-tag src="https://drive.google.com/a/georepublic.de/file/d/1o0uA28zIDkDIdwPv4Ql52irGHcs-OHWp/"></media-tag>

- Make sure you have [Node.js](https://nodejs.org/en/download/) - version 10 or newer

- ... you can check in a terminal by running `node -v`
- ... on mac you may need to open the packager with `right-click` > `open`
- ... If you use the installer, consider [setting the global npm directory](https://github.com/mixonic/docs.npmjs.com/blob/master/content/getting-started/fixing-npm-permissions.md#option-2-change-npms-default-directory-to-another-directory)

- Make sure you have the latest npm installed. `npm install npm@latest -g`
- _(If you want to work on the design:_ [Sketch](https://www.sketch.com/) _(Note: you can work on the design without Sketch, but its a bit harder))_
- ... add [Expo-export plugin] for Sketch (https://github.com/consento-org/expo-export/releases) Make sure your Sketch plugins are up to date.
- _(as well as Code editor - [VSCode](https://code.visualstudio.com/) to work on code, recommended)_
- ... add [eslint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for VSCode
- Make sure you have a mobile phone with Expo installed [App Store](https://apps.apple.com/us/app/expo-client/id982107779) or [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en) or a simulator (TODO: explain/link simulator documentation)
- And an expo account for notifications to work ([sign up](https://expo.io/signup))


## Getting started

0. _You need to run it in the correct folder. `cd ...`_
1. Make sure you have the [mobile app](https://github.com/consento-org/mobile) git repository cloned on your computer
2. Open the folder of the local copy in a Terminal - _(VSCode if you have it or a terminal app)_ 
3. Run `npm install` **this may take 2~3mins**
4. Run `npx expo login` - to login with your expo account - important for getting notification tokens.
5. Run `npm start` to start the development process
6. _(IPhone only):_ Open the camera and scan the QR code
7. _(Android only):_ Open the expo app and scan the QR code
8. TODO: document the simulator step


## General Workflow

- Make sure you work in your own branch.
- To reload the mobile app you have three options:


1. Shake your device until a restart dialog shows.
2. Close the mobile app and start again from expo home screen.
3. If your mobile phone is an Android phone and is connected to your computer, you can run `npm run android:reload` to reload your app.


- Work on git branches! Preferably create small branches from the master branch and commit your changes often, using Sourcetree.
- Push your new branches to github and create Pull Requests with the changes.


## Pull request

When you send a GitHub Pull Request to consento, please write with a clear list of what you've done, and attribute to co-authors if any. Make sure all of your commits are atomic (one feature per commit). Please follow our coding conventions (below).

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

	$ git commit -m "A brief summary of the commit
	>
	> A paragraph describing what changed and its impact."


## Coding conventions

Start reading our code and you'll get the hang of it. We optimize for readability:

- We indent using two spaces (soft tabs)
- We use HAML for all views
- We avoid logic in views, putting HTML generators into helpers
- We ALWAYS put spaces after list items and method parameters ([1, 2, 3], not [1,2,3]), around operators (x += 1, not x+=1), and around hash arrows.
- This is open source software. Consider the people who will read your code, and make it look nice for them. It's sort of like driving a car: Perhaps you love doing donuts when you're alone, but with passengers the goal is to make the ride as smooth as possible.
- So that we can consistently serve images from the CDN, always use image_path or image_tag when referring to images. Never prepend "/images/" when using image_path or image_tag.
- Also for the CDN, always use cwd-relative paths rather than root-relative paths in image URLs in any CSS. So instead of url('/images/blah.gif'), use url('../images/blah.gif').


## Update Workflow

When you get a new version Consento

- If the `package.json` file changed...
- ... stop any previously called `npm start` commands
- ... run `npm install` with the terminal in the folder of the local copy
- ... run `npm start` again
- In any case: new changes from master might break the data stored on your mobile device! Use the reset dialog to delete data in that case. 

[TODO: screenshot]

## Code Workflow

- The `src/style/component` folder is the biggest source for design settings. Edits in this folder are OK (specially if you don't have sketch installed) but before the changes can be merged they need to be merged by hand in the sketch file (to prevent future edit conflicts).
- The `src/Assets.tsx` and `src/styles/Component.tsx` file are generated through expo-export ([here](https://github.com/consento-org/expo-export/blob/be067e387d42aedc3e3e738ef6dce4a3c6ed5e0a/src/generate/components.ts#L462) and [here](https://github.com/consento-org/expo-export/blob/be067e387d42aedc3e3e738ef6dce4a3c6ed5e0a/src/generate/assets.ts#L112)). If you need to change something in those or other files generated by expo-export you may need to also update the plugin itself to prevent future edits.

## Design Workflow

Open the `./design/design.sketch` in Sketch.

Layer names will correspond to the exported file/variable names. Layers or artboards which names begin with `#` will be ignored in the export.

If you notice an element that exists in the app but not in the sketch file it means that element was added by hand. If you have the time please add the element in Sketch and send a Pull Request asking to connect some UI to it.

- `export all` will execute all processes but because it takes a while, you can run partial processes for a quicker export.
- `export components` will export all information related to position & text.
- `export assets` will export all artboards with _"export"_ presets. (see next section).
- `export textstyles` will export all **named** textstyles. - use it if you added/changed a common text style.
- `export fonts` will export new fonts. Only use if we change the whole new system font. The new font needs to be added to [the fonts folder](https://github.com/consento-org/mobile/tree/master/assets/fonts) by hand!
- `export color` will export all named colors (in the color palette).

*note: don't use `name` (or `backgroundColor`, `width`, `height`, `Render`, `Text`, `Image`, `Slice9`) when you name arboarts, because it will conflict with internal variables. [ISSUE#2](https://github.com/consento-org/expo-export/issues/2)*

After the export you should see updates in the `/styles/` folder. (also visible in Sourcetree)

[IMG]

Changes in your `.sketch files` **will cause GIT conflicts**. But don't worry: **THIS IS OKAY!** We have the changes also in text form and that makes it relatively easy to manually merge conflicting files. It's on us.

TODO:
- Try out [https://kactus.io/](https://kactus.io/) to see if it can be used to fix conflicts.
- Practice how to resolve conflicts with Martin and write down documentation.
- Create issue on regards to exporting Component.tsx error in the DevTools


### Assets

To add an asset, simply create a new artboard in the Sketch file.

<media-tag src="https://drive.google.com/a/georepublic.de/file/d/1o-Fi-2U_zS2hQrKEDzRj836xPO8LPLoH/"></media-tag>

Make it exportable and specify the export preset settings.

<media-tag src="https://drive.google.com/a/georepublic.de/file/d/1nzL3qdRTk4uB3Yfu1OKzJsvzSBoOhWO9/"></media-tag>

We use the export sizes: `1x`, `2x`, `3x` and `1.5x`.

<media-tag src="https://drive.google.com/a/georepublic.de/file/d/1nztidcC9nlBYclmR9J13FCTn0s2IbrSz/"></media-tag>

To make it more convenient for you, you can specify a default preset in Sketch that is applied every time you make an artboart exportable.

Don't forget to run `export assets` after you created or updated an asset.

<media-tag src="/blob/c2/c22bd6e45a428f96f7bec18a6b130658a3adc5f75fc42b9e" data-crypto-key="cryptpad:18Vkvisj0uo8v7YfxNmWb/YVOrO4AZ8StWhO4RFrV58="></media-tag>


### Debugging expo-export

1. Install the [sketch dev tools](https://github.com/skpm/sketch-dev-tools/releases/tag/v0.9.9) plugin
2. Open the Plugin > Dev Tools 
3. See an output log on every consento command.



## Code of conduct

We are open to discussions and divergence of points of view. Specially on how to resolve tech challenges or find new features to solve usability issues.
However, as for consento project, the consento team will remain in charge when it comes to merge, deploy or promotions of the technology.

We are committed to do some good tech that can be of valuable use for users and coders. 


### Some links

Keybase chat: https:  https://keybase.io/team/consento
Questions, mail to: keepsafe@consento.org
