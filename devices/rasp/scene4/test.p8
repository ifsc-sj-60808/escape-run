pico-8 cartridge // http://www.pico-8.com
version 41
__lua__
--test

--startup--
function _init()

	msg=''
 -- wiringpi pin numbers:
 clk=0   -- bcm17  (phys 11)
 dat=1   -- bcm18  (phys 12)
 stb=2   -- bcm27  (phys 13)

 -- helper: drive a gpio pin to 0 or 1 with serial() for precise timing
 -- (channel 0..254 maps to a gpio; 0xff is a delay channel)
 -- manual: serial pin channels & microsecond delays. :contentreference[oaicite:3]{index=3}
 one  = 0x4301  poke(one, 0xff)
 zero = 0x4300  poke(zero,0x00)

end

local function gpio(pin, val)
	serial(pin, val and one or zero, 1)
end

local function delay(us)      
	serial(0x0ff, 0, us)
end

local function send_bit(b)
  gpio(dat, b)        
  -- set data
  gpio(clk, 1) delay(50)
  gpio(clk, 0) delay(50)
end

local function send_byte(v)
  for i=0,7 do
    send_bit( band(v, shl(1,i)) ~= 0 )
  end
end

function send_msg_gpio(msg)
  gpio(stb, 1)            -- mark start
  for i=1,#msg do send_byte(ord(msg,i)) end
  send_byte(0)            -- nul terminator
  gpio(stb, 0)
end


--update--
function _update()
	send_msg_gpio(msg)
	if btnp(❎) then
		msg='x'
	end
end


--draw--
function _draw()
	print(msg)
end
__gfx__
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00700700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00077000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00077000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00700700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
