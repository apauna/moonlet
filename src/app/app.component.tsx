import { h, Component } from 'preact';
import {Router, CustomHistory, RouterOnChangeArgs} from "preact-router";
import AsyncRoute from "preact-async-route";

import './app.scss';
import { ROUTES, IRouteConfig } from './routes';
import { DeviceScreenSize } from './types';
import { getScreenSizeMatchMedia } from './utils/screen-size-match-media';

interface IProps {
	history: CustomHistory,
	platform: "web" | "extension",

	onScreenSizeChange: {(screenSize: DeviceScreenSize)}
	onRouteChange: {(routeConfig: IRouteConfig)}
}

export default class App extends Component<IProps, {}> {
	private phoneMediaQuery;
	public state;

	constructor(props: IProps) {
		super(props);

		this.phoneMediaQuery = getScreenSizeMatchMedia();
		this.phoneMediaQuery.addListener(this.onPhoneMediaQueryChange.bind(this));
	}

	onPhoneMediaQueryChange(media) {
		if (media.matches) {
			this.props.onScreenSizeChange(DeviceScreenSize.SMALL);
		} else {
			this.props.onScreenSizeChange(DeviceScreenSize.BIG);
		}
	}

	handleRouteChange(route: RouterOnChangeArgs) {
		//console.log(route);
		this.props.onRouteChange(route.current.attributes.config);
	}

	render(props: IProps) {
		//console.log("app props", props);
		return (
			<div class="app-root">
				<Router history={props.history} onChange={this.handleRouteChange.bind(this)}>
					{ROUTES.map((route) => (
						<AsyncRoute {...route}/>
					))}
				</Router>
			</div>
		);
	}
}