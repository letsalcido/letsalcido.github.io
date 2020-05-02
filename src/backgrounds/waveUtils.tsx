function generateSquareGridVertices(size: number, segments: number, depth: number) : number[] {
    const vertices = [];
    const segmentSize = size/segments;
    const halfSize = size/2;
    for (let i = 0; i <= segments; i ++ ) {
        let y = ( i * segmentSize ) - halfSize;
        for ( let j = 0; j <= segments; j ++ ) {
            let x = ( j * segmentSize ) - halfSize;
            vertices.push( x, - y, Math.random() * depth * 2 - depth);
        }
    }
    return vertices;
}

export function generateIndexedTriangles(size: number, segments: number, depth: number) : number[][] {
    const indices = [];
    const vertices = generateSquareGridVertices(size, segments, depth);

    for (let i = 0; i < segments; i ++ ) {
        for (let j = 0; j < segments; j++) {
            let a = i * (segments + 1) + (j + 1);
            let b = i * (segments + 1) + j;
            let c = (i + 1) * (segments + 1) + j;
            let d = (i + 1) * (segments + 1) + (j + 1);
            indices.push(a, b, d);
            indices.push(b, c, d);
        }
    }

    return [indices, vertices];
}

export function generateTriangles(size: number, segments: number, depth: number) : number[] {
    const [indices, vertices] = generateIndexedTriangles(size, segments, depth);
    const nv = [];
    for(let i=0; i < indices.length; i++) {
        nv.push(vertices[indices[i]*3], vertices[indices[i]*3+1], vertices[indices[i]*3+2]);
    }
    return nv;
}

export function computeWaves(triangles: number[], amplitude: number) : number[] {
    const nt = triangles.slice();
    const speed = 0.7;
    for(let i=0; i < triangles.length; i+=3) {
        const t = Date.now();
        const cosxy = amplitude * 2 * Math.cos((nt[i] + nt[i+1]) * Math.sqrt(speed) * 0.3 + 5);
        const wave = Math.sin(speed*(t/1000) + cosxy - nt[i] * 0.5);
        const offset = amplitude * 0.5 * Math.sin(t/1000 + cosxy);
        nt[i+2] += amplitude * wave + offset;
    }
    return nt;
}
