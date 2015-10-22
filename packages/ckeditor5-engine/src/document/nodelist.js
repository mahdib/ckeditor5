/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

CKEDITOR.define( [
	'document/character',
	'document/text',
	'document/node',
	'utils'
], function( Character, Text, Node, utils ) {
	/**
	 * @class document.NodeList
	 */
	class NodeList {
		constructor( nodes ) {
			if ( nodes instanceof NodeList ) {
				// We do not clone anything.
				return nodes;
			}

			// debugger;

			this._nodes = [];

			if ( nodes ) {
				var node, i, j, nodeLen, nodesLen;

				if ( !utils.isArray( nodes ) ) {
					nodes = [ nodes ];
				}

				for ( i = 0, nodesLen = nodes.length; i < nodesLen; i++ ) {
					node = nodes[ i ];

					if ( node instanceof Node ) {
						this._nodes.push( node );
					} else if ( node instanceof Text ) {
						for ( j = 0, nodeLen = node.text.length; j < nodeLen; j++ ) {
							this._nodes.push( new Character( node.text[ j ], utils.clone( node.attrs ) ) );
						}
					} else {
						for ( j = 0, nodeLen = node.length; j < nodeLen; j++ ) {
							this._nodes.push( new Character( node[ j ] ) );
						}
					}
				}
			}
		}

		get( index ) {
			return this._nodes[ index ];
		}

		insert( index, nodeList ) {
			this._nodes.splice.apply( this._nodes, [ index, 0 ].concat( nodeList._nodes ) );
		}

		remove( index, number ) {
			this._nodes.splice( index, number );
		}

		indexOf( node ) {
			return this._nodes.indexOf( node );
		}

		get length() {
			return this._nodes.length;
		}

		[ Symbol.iterator ]() {
			return this._nodes[ Symbol.iterator ]();
		}
	}

	return NodeList;
} );