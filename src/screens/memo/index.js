import React, { Component } from 'react';
import { AdMobBanner } from 'react-native-admob';
import {

    SafeAreaView,
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Animated,
    Easing,
    Image,
    Dimensions
} from 'react-native';
import { Color } from '../../global_config'

import Realm from 'realm'
import { realmOptions } from '../../storage/realm'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import DraggableFlatList from 'react-native-draggable-flatlist'
import { adUnitID } from '../../config/admob'

const width = Dimensions.get('window').width
const iconMargin = 44
const iconSize = 40  //
const bottomPos = 44 * 2

const leftPosition = iconMargin * 1
const rightPostioin = width - iconMargin * 2 - iconSize

export class MemoIndex extends Component {


    /******************************
     * lifecycle
     ******************************/

    constructor(props) {
        super(props)

        console.log("constructor", leftPosition, rightPostioin);
        this.state = {
            data: [],
            footerXAnim: new Animated.Value(-300),
            footerItem1: new Animated.Value(leftPosition),
            footerItem2: new Animated.Value(rightPostioin),
            itemScale: new Animated.Value(1),

            iconSize: new Animated.Value(1),
            hand: 'left' //left, right
        }

    }

    componentDidMount = () => {
        this.load()
        this.loadSetting()
        // this.footerSlideIn()

        //詳細から戻って来た時にloadするように
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.load();
        });


    }

    componentWillUnmount() {
        this._unsubscribe;
    }

    /******************************
     * Animation
     ******************************/
    footerSlideIn = () => {
        // slide X
        Animated.timing(
            this.state.footerXAnim,
            {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }
        ).start();
    }

    changeIconPosition = (hand) => {

        console.log("■■■■", hand);
        const item1 = hand == 'left' ? rightPostioin + 44 : leftPosition
        const item2 = hand == 'left' ? leftPosition - 44 : rightPostioin


        console.log("item1, item2", item1, item2)
        const conf = {
            duration: 300,
            useNativeDriver: true
        }
        Animated.parallel([
            Animated.timing(
                this.state.footerItem1,
                {
                    toValue: item1,
                    ...conf
                }
            ),
            Animated.timing(
                this.state.footerItem2,
                {
                    toValue: item2,
                    ...conf
                }
            )
        ]).start()
    }

    _itemTransformAnimation = (toValue) => {
        const { itemScale } = this.state
        Animated.timing(itemScale, {
            toValue: toValue,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }


    /**
     * dynamic style
     */
    dynamicStyle = () => {
        const interPolateSize = this.state.iconSize.interpolate({
            inputRange: [0, 50, 100, 150],
            outputRange: [1, 1.5, 1.2, 1],
        });

        return {
            // transformX: {
            //     transform: [{ translateX: this.state.footerXAnim }]
            // },
            transFormItem1: {
                transform: [
                    // { translateX: this.state.footerItem1 },
                    { translateX: this.state.footerItem1 },
                    { scale: interPolateSize }
                ]
            },
            transFormItem2: {
                transform: [
                    { translateX: this.state.footerItem2 },
                    { scale: interPolateSize }
                ],
            },
            icon: {
                transform: [{ scale: interPolateSize }],
            }
        }
    }

    /******************************
     * action
     ******************************/
    load = () => {
        Realm.open(realmOptions).then(realm => {
            // console.log(realm.path);
            let memos = realm.objects('Memo').sorted('order', false);// true=降順
            console.log("memos", memos)
            this.setState({
                data: memos
            })
        });
    }


    saveSetting = () => {
        Realm.open(realmOptions).then(realm => {
            const { hand } = this.state
            const newHand = hand == 'left' ? 'right' : 'left'
            realm.write(() => {
                const params = {
                    id: '1',
                    hand: newHand
                }
                realm.create(
                    'Setting',
                    params,
                    true)
            })
            this.changeIconPosition(hand)
            this.setState({ hand: newHand })
        });
    }

    saveOrder = (data) => {

        Realm.open(realmOptions).then(realm => {
            data.map((item, index) => {
                console.log(index, item)
                // save
                realm.write(() => {
                    const params = {
                        id: item.id,
                        order: index
                    }
                    realm.create('Memo', params, true)
                })
            })
        });
    }


    loadSetting = () => {
        Realm.open(realmOptions).then(realm => {
            let setting = realm.objects('Setting').filtered('id == $0', '1')[0];
            this.setState({
                hand: setting.hand
            })
        });

    }

    onPressNew = () => {
        // this.pushIcon()
        this.props.navigation.navigate('メモ')
    }

    onPressEdit = (id) => {
        this.props.navigation.navigate('メモ', { id: id })
    }

    onPressChange = () => {
        // this.pushIcon()
        this.saveSetting()
    }

    onPressTest = () => {
        // this.pushIcon()
        this.props.navigation.navigate('test')
    }

    itemOnLongPress = (drag) => {
        this._itemTransformAnimation(0.95)
        drag();
    }

    onDragEnd = ({ data }) => {
        console.log("onDragEnd")
        this._itemTransformAnimation(0.1)
        this.saveOrder(data)
        this.setState({
            data: data
        })
    }
    /******************************
     * render
     ******************************/

    renderItem = ({ item, index, drag, isActive }) => {
        const { data, itemScale } = this.state

        const activeStyle = {
            backgroundColor: "#ffdddd",
            borderColor: "red",
            borderWidth: 1,
            transform: [
                { scale: itemScale },
            ],

        };

        const dStyle = isActive ? activeStyle : []
        const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

        return (
            <>
                <AnimatedTouchable
                    key={index}
                    style={[styles.cell, dStyle]}
                    onPress={() => this.onPressEdit(item.id)}
                    onLongPress={() => this.itemOnLongPress(drag)}
                >
                    <Text numberOfLines={1} ellipsizeMode={'clip'} style={styles.cell__text}>{this.titleOneLine(item.text)}</Text>
                </AnimatedTouchable>
                {/* 最後の要素の場合、ボタンと被らないで表示できるように余白要素を追加する */}
                { index == data.length - 1 && <View style={styles.last_cell}></View>}
            </>
        )
    }

    titleOneLine = (text) => {
        return text.split('\n')[0]
    }


    render = () => {
        const { hand } = this.state
        //animation style
        const dStyle = this.dynamicStyle()


        return (
            // <> フラグメントの省略記法
            <SafeAreaView style={styles.center}>
                <DraggableFlatList
                    data={this.state.data}
                    // renderItem={({ item, index }) => this.listCell(item, index)}
                    keyExtractor={(item, index) => `draggable-item-${index}`}
                    renderItem={this.renderItem}
                    style={styles.listView}
                    onDragEnd={this.onDragEnd}
                />

                <Animated.View style={[styles.footer]}>
                    <Animated.View style={[styles.footer__item1, dStyle.transFormItem1]}>
                        <TouchableWithoutFeedback onPress={this.onPressNew} >
                            <Image style={styles.icon} source={require('../../assets/plus_mark_filled.png')} />
                        </TouchableWithoutFeedback>
                    </ Animated.View>

                    <Animated.View style={[styles.footer__item2, dStyle.transFormItem2]}>
                        <TouchableWithoutFeedback onPress={this.onPressChange} >
                            <Image style={styles.icon} source={require('../../assets/change_mark_filled.png')} />
                        </TouchableWithoutFeedback>
                    </ Animated.View>


                </Animated.View>
                <AdMobBanner
                    adSize="fullBanner"
                    adUnitID={adUnitID()}
                    testDevices={[AdMobBanner.simulatorId]}
                    onAdFailedToLoad={(error) => console.error(error)}
                />

            </SafeAreaView>
            // </> フラグメントの省略記法
        );
    }

}



const styles = StyleSheet.create({
    center: {
        flex: 1,
        backgroundColor: "white",
    },
    header: {
        height: 120,
        width: '100%',
        padding: 20,
        flexDirection: "row",
    },
    listView: {
        borderTopWidth: 1,
        borderColor: '#ccc',
        // flex: 1,
        // backgroundColor: 'blue',
    },
    cell: {
        height: 44,
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        backgroundColor: '#fdfdfd',
    },
    last_cell: {
        height: 100,
    },
    cell__text: {
        fontSize: 20,
        color: "#555",
    },

    // styles footer
    footer: {
        // bottom: bottomPos,
        // height: 60,
        paddingTop: 3,
        paddingBottom: 6,
        // backgroundColor: 'red',
        alignItems: 'center',
        flexDirection: 'row',
        // borderTopWidth: 0.5,
        // borderBottomWidth: 2,
        borderColor: "#000",

        // backgroundColor: "#dfdfdf",
    },


    footer__item1: {
        // position: 'absolute',
        // bottom: bottomPos,
        // left: 44
    },
    footer__item2: {
        // position: 'absolute',
        // bottom: bottomPos,
        // right: 44
    },

    icon: {
        width: iconSize,
        height: iconSize,
    },
    testButton: {
        width: iconSize,
        height: iconSize,
        borderWidth: 1,
        backgroundColor: 'red'

    }



});


