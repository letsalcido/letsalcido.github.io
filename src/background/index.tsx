import React, {useEffect, useRef} from 'react';
import styles from './styles.module.scss';
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const camerapos = new THREE.Vector3(0,-4,10);
let zoom = 0.8;
camerapos.multiplyScalar(1/zoom);
camera.position.x = camerapos.x;
camera.position.y = camerapos.y;
camera.position.z = camerapos.z;
camera.lookAt(0,0,0);
const size = 40;

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
const setRendererSize = ()=> {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize( window.innerWidth, window.innerHeight );
};

const geometry = new THREE.BufferGeometry();
const material = new THREE.MeshPhongMaterial({
    color: 0x18344a
});
const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const light = new THREE.PointLight(0xffffff, 0.8 );
light.position.set(0,size*2,100);
scene.add(light);

const lightHelper = new THREE.PointLightHelper(light, 1);
scene.add(lightHelper);

const ambient = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambient);

function generateTriangles() {
    const indices = [];
    const vertices = [];
    const segments = 50;
    const halfSize = size / 2;
    const segmentSize = size / segments;
    const depth = segmentSize * .20;

    let i;
    // generate vertices, normals and color data for a simple grid geometry
    for (i = 0; i <= segments; i ++ ) {
        let y = ( i * segmentSize ) - halfSize;
        for ( let j = 0; j <= segments; j ++ ) {
            let x = ( j * segmentSize ) - halfSize;
            vertices.push( x, - y, Math.random() * depth * 2 - depth);
        }
    }

    for (i = 0; i < segments; i ++ ) {
        for (let j = 0; j < segments; j++) {
            let a = i * (segments + 1) + (j + 1);
            let b = i * (segments + 1) + j;
            let c = (i + 1) * (segments + 1) + j;
            let d = (i + 1) * (segments + 1) + (j + 1);
            indices.push(a, b, d);
            indices.push(b, c, d);
        }
    }

    const nv = [];
    for(i=0; i < indices.length; i++) {
        nv.push(vertices[indices[i]*3], vertices[indices[i]*3+1], vertices[indices[i]*3+2]);
    }
    return nv;
}
const triangles = generateTriangles();

function addWaves(triangles: number[], s: number) : number[] {
    const nt = triangles.slice();
    const speed = 0.5;
    const amplitude = size/40;
    for(let i=0; i < triangles.length; i+=3) {
        const t = Date.now();
        const cosxy = amplitude * Math.cos((nt[i] + nt[i+1]) * speed * 0.3 + 5);
        const wave = Math.sin(speed*(t/1000 - nt[i]) + cosxy);
        nt[i+2] += amplitude * wave;
    }
    return nt;
}

function animate() {
    requestAnimationFrame( animate );
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(addWaves(triangles, 0.1), 3));
    geometry.computeVertexNormals();
    renderer.render( scene, camera );
}

export default function Background() : React.FunctionComponentElement<any> {

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(ref?.current) {
            ref.current.appendChild(renderer.domElement);
            animate();
        }
    }, [renderer.domElement]);

    useEffect(() => {
        window.addEventListener('resize', setRendererSize);
        setRendererSize();
        return () => {
            window.removeEventListener('resize',setRendererSize);
        }
    }, []);

    return (
      <div className={styles.background} ref={ref}>
      </div>
    );
}