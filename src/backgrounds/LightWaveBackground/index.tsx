import React, {useEffect, useRef} from 'react';
import styles from './Background.module.scss';
import * as Waves from '../waveUtils';
import * as THREE from 'three';
import {computeWaves} from "../waveUtils";

let size: number = 60,
    scene: THREE.Scene = new THREE.Scene(),
    camera: THREE.PerspectiveCamera,
    initcpos: THREE.Vector3,
    renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer(),
    geometry: THREE.BufferGeometry,
    indices: number[],
    positions: number[],
    amplitude: number = 1;

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
        color: 0x0e1e2b
    }));
    scene.add( mesh );

    const light = new THREE.PointLight(0xffffff, 3 );
    light.position.set(0,size*2,50);
    scene.add(light);

    scene.add(new THREE.AmbientLight(0xbb5842, 1));
    scene.fog = new THREE.Fog(0x0B1620, 30, 0);

    [indices, positions] = Waves.generateIndexedTriangles(size,100, 0);
}

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

function animate() {
    requestAnimationFrame( animate );
    geometry.setIndex(indices);
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(computeWaves(positions, amplitude), 3));
    geometry.computeVertexNormals();
    const cpos = initcpos.clone();
    cpos.applyAxisAngle(new THREE.Vector3(0,1,0), 0.8 * cx);
    cpos.applyAxisAngle(new THREE.Vector3(1,0,0), 0.1 * cy);
    cx += (mx - cx)/20;
    cy += (my - cy)/20;
    camera.position.x = cpos.x;
    camera.position.y = cpos.y;
    camera.position.z = cpos.z;
    renderer.render( scene, camera );
}

export default function LightWaveBackground() : React.FunctionComponentElement<any> {

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
        window.addEventListener('mousemove', handleMouse);
        handleScreenResize();
        return () => {
            window.removeEventListener('mousemove', handleMouse);
            window.removeEventListener('resize',handleScreenResize);
        }
    }, []);

    return (
      <div className={styles.background} ref={ref}>
      </div>
    );
}