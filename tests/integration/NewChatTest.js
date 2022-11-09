import React from 'react';
import Onyx from 'react-native-onyx';
import {Linking, AppState} from 'react-native';
import {fireEvent, render} from '@testing-library/react-native';
import lodashGet from 'lodash/get';
import moment from 'moment';
import App from '../../src/App';
import CONST from '../../src/CONST';
import ONYXKEYS from '../../src/ONYXKEYS';
import waitForPromisesToResolve from '../utils/waitForPromisesToResolve';
import waitForPromisesToResolveWithAct from '../utils/waitForPromisesToResolveWithAct';
import * as TestHelper from '../utils/TestHelper';
import appSetup from '../../src/setup';
import fontWeightBold from '../../src/styles/fontWeight/bold';
import * as AppActions from '../../src/libs/actions/App';
import * as NumberUtils from '../../src/libs/NumberUtils';
import LocalNotification from '../../src/libs/Notification/LocalNotification';
import * as Report from '../../src/libs/actions/Report';
import * as CollectionUtils from '../../src/libs/CollectionUtils';

jest.mock('../../src/libs/Notification/LocalNotification');

beforeAll(() => {
    // In this test, we are generically mocking the responses of all API requests by mocking fetch() and having it
    // return 200. In other tests, we might mock HttpUtils.xhr() with a more specific mock data response (which means
    // fetch() never gets called so it does not need mocking) or we might have fetch throw an error to test error handling
    // behavior. But here we just want to treat all API requests as a generic "success" and in the cases where we need to
    // simulate data arriving we will just set it into Onyx directly with Onyx.merge() or Onyx.set() etc.
    global.fetch = TestHelper.getGlobalFetchMock();

    // We need a large timeout here as we are lazy loading React Navigation screens and this test is running against the entire mounted App
    jest.setTimeout(30000);
    Linking.setInitialURL('https://new.expensify.com/r/1');
    appSetup();
});

const REPORT_ID = '1';
const USER_ACCOUNT_ID = 1;
const USER_EMAIL = 'user@test.com';

/**
 * Sets up a test with a logged in user that has one unread chat from another user. Returns the <App/> test instance.
 *
 * @returns {RenderAPI}
 */
function signInAndGetApp() {
    // Render the App and sign in as a test user.
    const renderedApp = render(<App />);
    return waitForPromisesToResolveWithAct()
        .then(() => {
            const loginForm = renderedApp.queryAllByA11yLabel('Login form');
            expect(loginForm).toHaveLength(1);

            return TestHelper.signInWithTestUser(USER_ACCOUNT_ID, USER_EMAIL, undefined, undefined, 'User');
        })
        .then(() => {
            // We manually setting the sidebar as loaded since the onLayout event does not fire in tests
            AppActions.setSidebarLoaded(true);
            return waitForPromisesToResolve();
        })
        .then(() => renderedApp);
}

describe('NewChatTest', () => {
    it('Create a new chat successfully', () => {
        // Given that a new user signed in
        let app;
        return signInAndGetApp()
            .then((testInstance) => {
                app = testInstance;
                app.debug();
            });
    });
});
