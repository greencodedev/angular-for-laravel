import {hcHome} from './admin/appearance/hc-home-config';
import {newTicketPage} from './admin/appearance/new-ticket-page-config';

export const BEDESK_CONFIG = {
    assetsPrefix: 'client',
    navbar: {
        defaultPosition: 'helpdesk-navbar',
        dropdownItems: [
            {route: '/mailbox', name: 'Agent Mailbox', icon: 'inbox', permission: 'tickets.view'},
            {route: '/help-center/manage', name: 'Help Center', icon: 'description', permission: 'articles.create'},
            {route: '/help-center/tickets', name: 'My Tickets', icon: 'inbox', role: 'customers'},
        ]
    },
    auth: {
        redirectUri: '/help-center',
        adminRedirectUri: '/help-center',
        color: 'accent',
    },
    accountSettings: {
        hideNavbar: false,
    },
    customPages: {
        hideNavbar: false,
    },
    demo: {
      email: 'admin@demo.com',
      password: 'demo',
    },
    admin: {
        hideAds: true,
        hideBilling: true,
        showIncomingMailMethods: true,
        appearance: {
            defaultRoute: 'help-center',
            navigationRoutes: [
                'help-center',
                'mailbox',
                'account/settings',
                'page'
            ],
            menus: {
                positions: [
                    'agent-mailbox',
                    'admin-navbar',
                    'header',
                    'custom-page-navbar'
                ],
                availableRoutes: [
                    '/help-center/tickets',
                    '/help-center/manage',
                    '/mailbox/tickets',
                    'mailbox/tickets/search',
                ]
            },
            sections: {
                hcHome,
                newTicketPage,

            }
        },
        settingsPages: [
            {route: 'ticketing', name: 'ticketing'},
            {route: 'help-center', name: 'help center'},
            {route: 'search', name: 'search'},
            {route: 'envato', name: 'envato'},
            {route: 'realtime', name: 'real time'},
        ],
        pages: [
            {route: 'triggers', permission: 'triggers.view', icon: 'device-hub', name: 'triggers'},
            {route: 'ticket-categories', permission: 'tags.view', icon: 'view-list', name: 'ticket categories'},
            {route: 'tags', permission: 'tags.view', icon: 'local-offer', name: 'tags'},
            {route: 'canned-replies', permission: 'canned_replies.view', icon: 'comment', name: 'canned replies'},
        ]
    },
};
