/**
 * Sort category by titles
 * @author: Helder (https://github.com/he7d3r)
 * @license: CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0/>
 * Inspired by
 * - [[w:WP:Esplanada/propostas/Categorização de pessoas lusófonas (24fev2013)]]
 * - [https://gerrit.wikimedia.org/r/gitweb?p=mediawiki/core.git;a=blob;f=includes/CategoryViewer.php;h=7678ffe080c4a2635926731a7ba6803cd622ca6a;hb=HEAD#l464]
 */
( function ( mw, $ ) {
	'use strict';

	var $pages;
	function getHtmlForItemWithLink( page ) {
		return '<li><a href="' +
			mw.util.getUrl( page ) +
			'" title="' + page +
			'">' + page + '</a></li>';
	}
	function columnList( list ) {
		var maxItemsPerCell = Math.ceil( list.length / 3 ),
			columns = [
				list.slice( 0, maxItemsPerCell ),
				list.slice( maxItemsPerCell, 2 * maxItemsPerCell ),
				list.slice( 2 * maxItemsPerCell )
			];
		$pages
			.find( 'td' )
				.empty()
			.each( function ( col ) {
				var i,
					$this = $(this),
					$clone = $this.clone(),
					$curList,
					isCont;
				for ( i = 0; i < columns[col].length; i++ ) {
					isCont = col > 0
						&& i === 0
						&& columns[col][i].charAt(0) === columns[col - 1][ maxItemsPerCell - 1 ].charAt(0);
					if ( i === 0
						|| columns[col][i].charAt(0) !== columns[col][i - 1].charAt(0)
						|| isCont
					) {
						$curList = $( '<ul></ul>' );
						$clone.append(
							$(
								'<h3>' +
								columns[col][i].charAt(0) + ( isCont ? ' cont.' : '' ) +
								'</h3>'
							),
							$curList
						);
					}
					$curList.append( getHtmlForItemWithLink( columns[col][i] ) );
				}
				$this.replaceWith( $clone );
			} );
	}

	function shortList( list ) {
		var i, $curList,
			$target = $pages.find( 'div' ).first().empty();
		for ( i = 0; i < list.length; i++ ) {
			if ( i === 0 || list[i].charAt(0) !== list[i - 1].charAt(0) ) {
				$curList = $( '<ul></ul>' );
				$target.append(
					$( '<h3>' + list[i].charAt(0) + '</h3>' ),
					$curList
				);
			}
			$curList.append( getHtmlForItemWithLink( list[i] ) );
		}
	}

	function formatList( list ) {
		if ( list.length > 6 ) {
			columnList( list );
		} else {
			shortList( list );
		}
	}

	function getCategoryMembers() {
		var list = $pages.find('ul a').map(function () {
			return this.title;
		}).get();
		if ( list.length >= 200 ) {
			// TODO: Use API to get the full list of category members?
			alert( 'Serão ordenados apenas os 200 itens presentes nesta página (talvez isso seja aprimorado no futuro).' );
		}
		return list;
	}

	function load() {
		$pages = $('#mw-pages');
		$pages.find('p').first().append(
			$('<a href="#">Ordernar alfabeticamente pelo nome</a>')
				.click( function (e) {
					e.preventDefault();
					formatList( getCategoryMembers().sort() );
				} )
		);
	}

	if ( mw.config.get( 'wgNamespaceNumber' ) === 14 && $.inArray( mw.config.get( 'wgAction' ), [ 'view', 'purge' ] ) !== -1 ) {
		$( load );
	}

}( mediaWiki, jQuery ) );
