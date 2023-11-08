/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module ckbox/ckboxui
 */

import { icons, Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';

import type { ImageInsertUI } from '@ckeditor/ckeditor5-image';

import browseFilesIcon from '../theme/icons/browse-files.svg';
import type CKBoxCommand from './ckboxcommand';

/**
 * The CKBoxUI plugin. It introduces the `'ckbox'` toolbar button.
 */
export default class CKBoxUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	public static get pluginName() {
		return 'CKBoxUI' as const;
	}

	/**
	 * @inheritDoc
	 */
	public afterInit(): void {
		const editor = this.editor;

		const command: CKBoxCommand | undefined = editor.commands.get( 'ckbox' );

		// Do not register the `ckbox` button if the command does not exist.
		if ( !command ) {
			return;
		}

		const t = editor.t;
		const componentFactory = editor.ui.componentFactory;

		componentFactory.add( 'ckbox', locale => {
			const button = new ButtonView( locale );

			button.set( {
				label: t( 'Open file manager' ),
				icon: browseFilesIcon,
				tooltip: true
			} );

			button.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			button.on( 'execute', () => {
				editor.execute( 'ckbox' );
			} );

			return button;
		} );

		if ( editor.plugins.has( 'ImageInsertUI' ) ) {
			const imageInsertUI: ImageInsertUI = editor.plugins.get( 'ImageInsertUI' );

			imageInsertUI.registerIntegration( 'assetManager', command, type => {
				const button = this.editor.ui.componentFactory.create( 'ckbox' ) as ButtonView;

				button.icon = icons.imageFolder;

				if ( type == 'formView' ) {
					button.class = 'ck-image-insert__ck-finder-button';
					button.withText = true;

					// TODO add to context (note that it's shared with CKFinder)
					button.bind( 'label' ).to( imageInsertUI, 'isImageSelected', isImageSelected => isImageSelected ?
						t( 'Replace with File Manager' ) :
						t( 'Insert with File Manager' )
					);
				}

				return button;
			} );
		}
	}
}
