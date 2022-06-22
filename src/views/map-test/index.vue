<template>
  <div>
    <div class="content-wrapper">
      <div class="left-wrapper">
        <div id="map_container"></div>
      </div>
      <div class="right-wrapper">
        <ul class="user">
          <li
            class="user-item"
            v-for="(item, index) in userList"
            :key="index"
            @click="onClick(item)"
          >
            <div>{{ index }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// https://mapv.baidu.com/gl/docs/index.html 地图绘制文档地址
import { loadBMap } from "@/utils/remoteLoad";
import { style } from "./style";
import getAllData from "./locationdata";
import getSingleInfo from "./getSingleInfo";
let count = 0;
let mapvgl = null
export default {
  data() {
    return {
      currentPos: null,
      view: null, //图层对象
      map: null, //地图对象
      polyline: null, //折现对象
      polylineHighLight: null, //高亮折线对象
      userList: [], // 右侧显示列表
    };
  },
  methods: {
    async navigateTo (userObj, highLightPos) {
      let mapObj = this.map
      let infoWindow = {}
      mapObj.clearOverlays() //移除地图上所有的点标记
      this.view.removeAllLayers() //删除地图上所有可视化图层
      this.generateLayer(this.map, this.userList) //加载图层
      // 定位
      if (!highLightPos) {
        //如果不存在高亮线路,//直接定位过去
        mapObj.flyTo(new window.BMapGL.Point(userObj.longitude, userObj.latitude), 35)
      }
      mapObj.openInfoWindow(infoWindow, new window.BMapGL.Point(userObj.longitude, userObj.latitude)) // 打开信息窗口
    },
    generateMarker(mapObj, params) {
      //创建图标对象
      let myIcon = new window.BMapGL.Icon(
        params.icon,
        new window.BMapGL.Size(params.width, params.height)
      );
      let pt = new window.BMapGL.Point(params.longitude, params.latitude);
      let marker = new window.BMapGL.Marker(pt, {
        icon: myIcon,
      });
      marker.addEventListener("click", (e) => {
        let opts = {
          width: 300,
          height: 200,
          title: `<div>13232</div>`, // 信息窗口标题
        };
        let infoWindow = new window.BMapGL.InfoWindow(
          `
          <p class="body-address">dddd</p>
        `,
          opts
        );
        mapObj.openInfoWindow(
          infoWindow,
          new window.BMapGL.Point(params.longitude, params.latitude)
        ); // 打开信息窗口
      });
      return marker;
    },
    onClick(e) {
      count++
      count = count % 2
      getSingleInfo
        .then((resData) => {
          const res = resData[count]
          let currentPos = JSON.parse(JSON.stringify(e));
          currentPos.latitude = res.data.singleData[res.data.singleData.length - 1].latitude
          currentPos.longitude = res.data.singleData[res.data.singleData.length - 1].longitude
          this.currentPos = currentPos;
          this.navigateTo(currentPos);
        })
    },
    initMap(options) {
      //初始化地图
      options = Object.assign(
        {
          tilt: 60,
          heading: 0,
        },
        options
      );
      let map = (this.map = new window.BMapGL.Map("map_container", {
        restrictCenter: false,
      }));
      if (options.center && options.zoom) {
        map.centerAndZoom(
          new window.BMapGL.Point(options.center[0], options.center[1]),
          options.zoom
        );
      }
      map.setTilt(options.tilt);
      map.setHeading(options.heading);
      return map;
    },
    generateLayer(map, originData) {
      // 加载点聚合图层
      let data = [];
      originData.forEach((item) => {
        data.push({
          geometry: {
            type: "Point",
            coordinates: [item.longitude, item.latitude],
          },
          properties: {
            icon: require("../../assets/marker.png"),
            width: 10,
            height: 10,
            longitude: item.longitude,
            latitude: item.latitude
          },
        });
      });
      this.view = new mapvgl.View({
        map: map,
      });
      let clusterLayer = new mapvgl.ClusterLayer({
        minSize: 30, // 聚合点显示的最小直径
        maxSize: 50, // 聚合点显示的最大直径
        clusterRadius: 150, // 聚合范围半径
        gradient: { 0: "blue", 0.5: "green", 1.0: "red" }, // 聚合点颜色梯度
        maxZoom: 15, // 聚合的最大级别，当地图放大级别高于此值将不再聚合
        minZoom: 5, // 聚合的最小级别，当地图放大级别低于此值将不再聚合
        // 是否显示文字
        showText: true,
        // 开始聚合的最少点数，点数多于此值才会被聚合
        minPoints: 5,
        // 设置文字样式
        textOptions: {
          fontSize: 12,
          color: "white",
        },
        enablePicked: true
      });
      this.view.addLayer(clusterLayer);
      clusterLayer.setData(data);
    },
  },
  created() {
    mapvgl = window.mapvgl;
    //加载地图api
    // ak申请 https://lbsyun.baidu.com/index.php?title=jspopularGL
    // https://lbsyun.baidu.com/apiconsole/key?application=key#/home
    loadBMap("请填入ak", "GL")
      .then(() => {
        // 执行初始化地图方法
        let map = (this.map = this.initMap({
          //初始化地图对象
          style,
          tilt: 10,
          center: [109.792816, 27.702774],
          zoom: 5,
          skyColors: [
            // 地面颜色
            "rgba(226, 237, 248, 0)",
            // 天空颜色
            "rgba(186, 211, 252, 1)",
          ],
        }));
        getAllData.then((res) => {
          this.userList = [...res.data.locationData];
          this.generateLayer(map, res.data.locationData);
        });
      })
  },
};
</script>
<style lang="scss" scoped>
  .content-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left-wrapper {
      width: 80%;
      height: 100%;
      min-height: 600px;
      position: relative;
      #map_container {
        width: 100%;
        height: 100%;
        min-height: 600px;
      }
    }
    .right-wrapper {
      width: 20%;
      height: 100%;
      min-width: 300px;
      .user {
        width: 100%;
        height: 200px;
        padding: 0.6rem;
        overflow: auto;
        // background-color: #efefef;
        .user-item {
          width: 100%;
          padding: 5px;
          background-color: blueviolet;
          color: white;
          cursor: pointer;
        }
      }
    }
  }

</style>
