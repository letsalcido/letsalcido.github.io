import React, {useEffect, useRef} from 'react';
import styles from './Background.module.scss';
import * as Waves from '../waveUtils';
import * as THREE from 'three';
import * as d3 from 'd3-ease';
import {computeWaves} from "../waveUtils";

let size: number = 60,
    amplitude: number = 0.8,
    scene: THREE.Scene = new THREE.Scene(),
    camera: THREE.PerspectiveCamera,
    initcpos: THREE.Vector3,
    renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer(),
    geometry: THREE.BufferGeometry,
    triangles: number[],
    ambient: THREE.AmbientLight,
    light: THREE.PointLight,
    ambientIntensity: number = 0.5,
    lightIntensity: number = 2;

function init() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    initcpos = new THREE.Vector3(0,-size/3,10);
    camera.position.x = initcpos.x;
    camera.position.y = initcpos.y;
    camera.position.z = initcpos.z;
    camera.lookAt(0,-size/4,0);

    renderer.setPixelRatio( window.devicePixelRatio );

    geometry = new THREE.BufferGeometry();
    const mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({
        color: 0x18344a
    }));
    scene.add( mesh );

    light = new THREE.PointLight(0xffffff, lightIntensity );
    light.position.set(0,size*2,50);
    scene.add(light);

    ambient = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambient);
    scene.fog = new THREE.Fog(0x000000, 30, 0);

    triangles = Waves.generateTriangles(size,100, 0.08);
};

const handleScreenResize = ()=> {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize( window.innerWidth, window.innerHeight );
};

let width = window.innerWidth,
    height = window.innerHeight,
    [mx, my] = [0,0],
    [cx,cy] = [mx,my];
const handleMouse = (e: any) => {
    mx = ((e.clientX || mx) - width/2)/width;
    my = ((e.clientY || my) - height/2)/height;
};

const handleScroll = () => {
    let top = window.scrollY/height;
    light.intensity = lightIntensity - lightIntensity * top * top * 0.6;
    ambient.intensity = ambientIntensity * (1-d3.easeQuad(top));
};

function animate() {
    requestAnimationFrame( animate );
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(computeWaves(triangles, amplitude), 3));
    geometry.computeVertexNormals();
    const cpos = initcpos.clone();
    cpos.applyAxisAngle(new THREE.Vector3(0,1,0), cx);
    cpos.applyAxisAngle(new THREE.Vector3(1,0,0), 0.2 * cy);
    cx += (mx - cx)/25;
    cy += (my - cy)/25;
    camera.position.x = cpos.x;
    camera.position.y = cpos.y;
    camera.position.z = cpos.z;
    renderer.render( scene, camera );
}

export default function GeometricWaveBackground() : React.FunctionComponentElement<any> {

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        init();
        if(ref?.current) {
            ref.current.appendChild(renderer.domElement);
            animate();
        }
    }, [renderer.domElement]);

    useEffect(() => {
        window.addEventListener('resize', handleScreenResize);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouse);
        handleScreenResize();
        return () => {
            window.removeEventListener('mousemove', handleMouse);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize',handleScreenResize);
        }
    }, []);

    return (
      <div className={styles.background} ref={ref}>
      </div>
    );
}