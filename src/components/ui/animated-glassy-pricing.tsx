import React, { useRef, useEffect, useState } from 'react';
import { RippleButton } from "@/components/ui/multi-type-ripple-buttons";

// --- Internal Helper Components (Not exported) --- //

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3"
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ShaderCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glProgramRef = useRef<WebGLProgram | null>(null);
  const glBgColorLocationRef = useRef<WebGLUniformLocation | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const [backgroundColor, setBackgroundColor] = useState([0.039, 0.039, 0.039]); // Default to #0a0a0a for dark mode

  useEffect(() => {
    const root = document.documentElement;
    const updateColor = () => {
      const isDark = root.classList.contains('dark') || true; // Force dark for Daniyal Studio
      setBackgroundColor(isDark ? [0.039, 0.039, 0.039] : [1.0, 1.0, 1.0]);
    };
    updateColor();
  }, []);

  useEffect(() => {
    const gl = glRef.current;
    const program = glProgramRef.current;
    const location = glBgColorLocationRef.current;
    if (gl && program && location) {
      gl.useProgram(program);
      gl.uniform3fv(location, new Float32Array(backgroundColor));
    }
  }, [backgroundColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) { console.error("WebGL not supported"); return; }
    glRef.current = gl;

    const vertexShaderSource = `attribute vec2 aPosition; void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;
    const fragmentShaderSource = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec3 uBackgroundColor;
      mat2 rotate2d(float angle){ float c=cos(angle),s=sin(angle); return mat2(c,-s,s,c); }
      float variation(vec2 v1,vec2 v2,float strength,float speed){ return sin(dot(normalize(v1),normalize(v2))*strength+iTime*speed)/100.0; }
      vec3 paintCircle(vec2 uv,vec2 center,float rad,float width){
        vec2 diff = center-uv;
        float len = length(diff);
        len += variation(diff,vec2(0.,1.),5.,2.);
        len -= variation(diff,vec2(1.,0.),5.,2.);
        float circle = smoothstep(rad-width,rad,len)-smoothstep(rad,rad+width,len);
        return vec3(circle);
      }
      void main(){
        vec2 uv = gl_FragCoord.xy/iResolution.xy;
        uv.x *= 1.5; uv.x -= 0.25;
        float mask = 0.0;
        float radius = .35;
        vec2 center = vec2(.5);
        mask += paintCircle(uv,center,radius,.035).r;
        mask += paintCircle(uv,center,radius-.018,.01).r;
        mask += paintCircle(uv,center,radius+.018,.005).r;
        vec2 v=rotate2d(iTime)*uv;
        // Modified colors to fit the red/black aesthetic
        vec3 foregroundColor=vec3(v.x + 0.5, 0.1, 0.1);
        vec3 color=mix(uBackgroundColor,foregroundColor,mask * 0.5);
        color=mix(color,vec3(0.8, 0.1, 0.1),paintCircle(uv,center,radius,.003).r);
        gl_FragColor=vec4(color,1.);
      }`;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Could not create shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || "Shader compilation error");
      }
      return shader;
    };

    const program = gl.createProgram();
    if (!program) throw new Error("Could not create program");
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    glProgramRef.current = program;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iTimeLoc = gl.getUniformLocation(program, 'iTime');
    const iResLoc = gl.getUniformLocation(program, 'iResolution');
    glBgColorLocationRef.current = gl.getUniformLocation(program, 'uBackgroundColor');
    gl.uniform3fv(glBgColorLocationRef.current, new Float32Array(backgroundColor));

    let animationFrameId: number;
    const render = (time: number) => {
      gl.uniform1f(iTimeLoc, time * 0.001);
      gl.uniform2f(iResLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    animationFrameId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0 bg-[#0a0a0a]" />;
};

// --- EXPORTED Building Blocks --- //

export interface PricingCardProps {
  planName: string;
  description: string;
  pricePrefix?: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  buttonVariant?: 'primary' | 'secondary';
  onCtaClick?: () => void;
}

export const PricingCard = ({
  planName, description, pricePrefix = "$", price, priceSuffix = "/image", features, buttonText, isPopular = false, buttonVariant = 'primary', onCtaClick
}: PricingCardProps) => {
  const cardClasses = `
    backdrop-blur-[14px] bg-gradient-to-br rounded-2xl shadow-xl flex-1 w-full max-w-sm px-7 py-8 flex flex-col transition-all duration-300
    border border-white/5
    dark:from-white/5 dark:to-transparent dark:border-white/10 dark:backdrop-brightness-[0.91]
    ${isPopular ? 'scale-105 relative ring-2 ring-accent-red/40 dark:from-white/10 dark:to-transparent dark:border-accent-red/30 shadow-2xl z-10' : ''}
  `;
  const buttonClasses = `
    mt-auto w-full py-3 rounded-xl font-bold text-[14px] transition uppercase tracking-wider
    ${buttonVariant === 'primary' 
      ? 'bg-accent-red hover:bg-red-700 text-white shadow-[0_0_15px_rgba(224,27,27,0.3)]' 
      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
    }
  `;

  return (
    <div className={cardClasses.trim()}>
      {isPopular && (
        <div className="absolute -top-4 right-4 px-4 py-1 text-[12px] font-bold uppercase tracking-wider rounded-full bg-accent-red text-white shadow-[0_0_15px_rgba(224,27,27,0.5)]">
          Most Popular
        </div>
      )}
      <div className="mb-3">
        <h2 className="text-[32px] font-bold tracking-tight text-white">{planName}</h2>
        <p className="text-[15px] text-white/60 mt-2 min-h-[45px]">{description}</p>
      </div>
      <div className="my-6 flex items-baseline gap-1">
        <span className="text-[18px] text-white/70 font-medium mr-1">{pricePrefix}</span>
        <span className="text-[54px] font-black tracking-tighter text-white">{price}</span>
        <span className="text-[14px] text-white/50 ml-1">{priceSuffix}</span>
      </div>
      <div className="card-divider w-full mb-6 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1)_50%,transparent)]"></div>
      <ul className="flex flex-col gap-3 text-[15px] text-white/80 mb-8 font-medium">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckIcon className="text-accent-red w-5 h-5 flex-shrink-0 mt-0.5" /> 
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <RippleButton className={buttonClasses.trim()} onClick={onCtaClick}>{buttonText}</RippleButton>
    </div>
  );
};

// --- EXPORTED Customizable Page Component --- //

interface ModernPricingPageProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  plans: PricingCardProps[];
  showAnimatedBackground?: boolean;
}

export const ModernPricingPage = ({
  title,
  subtitle,
  plans,
  showAnimatedBackground = true,
}: ModernPricingPageProps) => {
  return (
    <div className="relative bg-[#0a0a0a] text-white min-h-screen w-full overflow-hidden py-24 border-t border-white/5">
      {showAnimatedBackground && <ShaderCanvas />}
      
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] z-0 pointer-events-none" />

      <main className="relative z-10 w-full flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-[40px] md:text-[56px] font-black tracking-tight text-white uppercase drop-shadow-lg">
            {title}
          </h2>
          <p className="mt-4 text-[16px] md:text-[20px] text-white/70 max-w-2xl mx-auto font-medium">
            {subtitle}
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 justify-center items-stretch w-full max-w-6xl px-4 lg:px-0">
          {plans.map((plan) => <PricingCard key={plan.planName} {...plan} />)}
        </div>
      </main>
    </div>
  );
};
