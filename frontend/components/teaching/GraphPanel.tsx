'use client'

import { useState, useEffect, Suspense, useRef } from 'react';




import MathScene from '../math/scene/MathScene'

import FunctionPlot from "../math/graphFunctions/FunctionPlot";
import Point2D from "../math/graphFunctions/Point2D";
import Label2D from "../math/graphFunctions/Label2D";
import ShadeArea from "../math/graphFunctions/ShadeArea";
import Line2D from "../math/graphFunctions/Line2D";
import SlidingTangent from "../math/graphFunctions/slidingTangent";
import { GraphObject } from "../math/types/graphObject";
import { Step } from "../math/types/steps";
import { CameraTarget } from "../math/types/cameraTarget";

type Props = {
    graphObjects: GraphObject[]
    cameraTarget: CameraTarget | null

}


export default function GraphPanel({graphObjects, cameraTarget}: Props) {
 


    return (
        <div className = "w-full h-full">
           
            
            <MathScene cameraTarget={cameraTarget} >
            <>
            {graphObjects.map(obj => {
                switch (obj.type) {
                    case 'function':
                        return <FunctionPlot key={obj.id} {...obj.props} />
                    case 'point':
                        return <Point2D key={obj.id} {...obj.props} />
                    case 'label':
                        return (
                            <Label2D key={obj.id} {...obj.props} />
                        )
                    case 'area':
                        return <ShadeArea key={obj.id} {...obj.props} />
                    case "slidingTangent":
                        return <SlidingTangent key={obj.id} {...obj.props} />;
                    case "line":
                        return <Line2D key={obj.id} {...obj.props} />;
                    default:
                        return null
                }
            })}
            </>
                
                

            </MathScene>
            
        </div>
    )
}