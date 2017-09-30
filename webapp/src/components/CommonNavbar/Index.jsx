import './index.css'
import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {NavBar,Icon} from 'antd-mobile'

class CommonNavbar extends Component {

	static propTypes = {
		centerText: PropTypes.string,
		showLeftIcon: PropTypes.any,
		fixed: PropTypes.bool,
		onBackbarClick: PropTypes.func
	}

	static defaultProps = {
		centerText: 'Navbar',
		showLeftIcon: 'left',
		fixed: false,
		onBackbarClick: () => {}
	}

	render() {
		let className = "m-common-navbar "
		if (this.props.fixed) {
			className += "m-common-navbar-fixed"
		}
		return (
			<div className="m-navbar-wrapper">
				<div className={className}>
					<NavBar
						mode="light"
						iconName={this.props.showLeftIcon}
						leftContent=""
						onLeftClick={e => this.props.onBackbarClick()}
						rightContent={[
							<Link to="/search" key="linksearch"><Icon key="0" type="search" color="#000" /></Link>
						]}
					>
						{this.props.centerText}
					</NavBar>
				</div>
				{
					this.props.fixed?<div className="t-fill-navbar"></div>:''
				}
			</div>
		)
	}
}

export default CommonNavbar