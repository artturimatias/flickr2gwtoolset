<xsl:transform
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  version="2.0"
  >
<xsl:output method="html" indent="yes" /> 
<xsl:strip-space elements="*" />

<xsl:variable name="language_selection">
	<xsl:value-of select="document('languages.xml')"/>

</xsl:variable>	
<xsl:param name="def_lang"></xsl:param>


<xsl:template match="/">

	<table>
		<xsl:apply-templates/>
	</table>

</xsl:template>


<xsl:template match="/set/record">
	  <tr>
		<th><h2>Kartta</h2></th>
		<th><h2>Metadata</h2><div class="button toggle">Metadata</div></th>
		
	</tr>
    <tr>
        <td class="info">
			
			<h3>
				<xsl:value-of select=".//title"/>
			</h3>
			<xsl:apply-templates select=".//thumbnail"/>
			<div>
				<input class="enabled" type="checkbox" checked="checked"/> Include photo
			</div>
			<div>	
				<b>description:</b><xsl:value-of select=".//description"/>
			</div>
			<div>
				<b>date:</b><xsl:value-of select=".//date"/>
			</div>

        </td>
		<td class="xml">
			
			

			<!-- commons_title -->
			<div class="holder">
				<div class="div_title">Otsikko Commonnissa</div>
				<div class="frame">
					
					<xsl:choose>
						<xsl:when test=".//commons_title">
							<xsl:apply-templates select=".//commons_title"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">commons_title</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
				
				</div>
			</div>
			
			<!-- titles -->
			<div class="holder">
				<div class="div_title">Titles</div>
				<div class="link addinput">+</div>
				<div class="frame">
			
					<xsl:apply-templates select=".//title"/>

				</div>
			</div>


			<!-- description -->
			<div class="holder">
				<div class="div_title">Descriptions</div>
				<div class="link addinput">+</div>
				<div class="frame">
			
					<xsl:apply-templates select=".//description" />
					
					
				</div>
			</div>

			<!-- description -->
			<div class="holder">
				<div class="div_title">Basic information</div>
				<div class="frame">

					<xsl:choose>
						<xsl:when test=".//author">
							<xsl:apply-templates select=".//author"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">author</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>

					<xsl:choose>
						<xsl:when test=".//date">
							<xsl:apply-templates select=".//date"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">date</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
					
				</div>
			</div>


			<!-- location -->
			<div class="holder">
				<div class="div_title">Geotemporal data</div>
				<div class="frame">
					
					<xsl:choose>
						<xsl:when test=".//map_date">
							<xsl:apply-templates select=".//map_date"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">map_date</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
					
					<xsl:choose>
						<xsl:when test=".//location">
							<xsl:apply-templates select=".//location"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">location</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
				





					<xsl:choose>
						<xsl:when test=".//wikidata_location">
							<xsl:apply-templates select=".//wikidata_location"/>
						</xsl:when>
						<xsl:otherwise>			
							<xsl:call-template name="wikidata_entry" >
								<xsl:with-param name="titleName">wikidata location</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>





					<xsl:choose>
						<xsl:when test=".//projection">
							<xsl:apply-templates select=".//projection"/>
						</xsl:when>
						<xsl:otherwise>			
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">projection</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>




					<xsl:choose>
						<xsl:when test=".//scale">
							<xsl:apply-templates select=".//scale"/>
						</xsl:when>
						<xsl:otherwise>			
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">scale</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>



					<xsl:choose>
						<xsl:when test=".//heading">
							<xsl:apply-templates select=".//heading"/>
						</xsl:when>
						<xsl:otherwise>			
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">heading</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>


					<xsl:choose>
						<xsl:when test=".//latitude">
							<xsl:apply-templates select=".//latitude"/>
						</xsl:when>
						<xsl:otherwise>			
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">latitude</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
					
					<xsl:choose>
						<xsl:when test=".//longitude">
							<xsl:apply-templates select=".//longitude"/>
						</xsl:when>
						<xsl:otherwise>			
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">longitude</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
					
					
				</div>
			</div>


			<!-- date -->
			<div class="holder">
				<div class="div_title"> Bibliographic data</div>
				<div class="frame">
					
					<xsl:choose>
						<xsl:when test=".//set">
							<xsl:apply-templates select=".//set"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">set</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>

					<xsl:choose>
						<xsl:when test=".//sheet">
							<xsl:apply-templates select=".//sheet"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">sheet</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
					
					<xsl:choose>
						<xsl:when test=".//publisher">
							<xsl:apply-templates select=".//publisher"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">publisher</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
			
				</div>
			</div>
			

			<!-- institution-->
			<div class="holder">
				<div class="div_title">Archival data</div>
				<div class="frame">
					<xsl:choose>
						<xsl:when test=".//institution">
							<xsl:apply-templates select=".//institution"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">institution</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>

					<xsl:choose>
						<xsl:when test=".//accession_number">
							<xsl:apply-templates select=".//accession_number"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">accession_number</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>					
				
				</div>
			</div>				


			<!-- permissions-->
			<div class="holder">
				<div class="div_title">Käyttöoikeudet</div>
				<div class="frame">
					<xsl:choose>
						<xsl:when test=".//permission">
							<xsl:apply-templates select=".//permission"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">permission</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</div>


			<!-- file-->
			<div class="holder">
				<div class="div_title">Tiedostot</div>
				<div class="frame">
					<xsl:apply-templates select=".//imgurl"/>
				</div>
			</div>	

			

			
			 <a href="#" class="button preview">preview</a> 
			<!-- <div class="button xml_export">XML</div> -->
			<!-- <button type="button" class="save2commons">Save to Commons!</button> -->
		</td>
    </tr>
    
</xsl:template>


<!-- ******************************************  -->
<!-- translatable fields (title and description) -->
<!-- ******************************************  -->

<xsl:template match="title">
	
			<div class="input_holder">
				<div id="basic_lang_input">
					<div>
						<div class="input_title">title:</div> 
					

					<xsl:choose>
						<xsl:when test="./@lang">
							<xsl:call-template name="lang_set" >
								<xsl:with-param name="lang">
									<xsl:value-of select="./@lang" />
								</xsl:with-param>
							</xsl:call-template>
							<input class="title_{./@lang}" name="title_{./@lang}" type="text" value="{.}"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="lang_set" >
								<xsl:with-param name="lang">
									<xsl:value-of select="$def_lang" />
								</xsl:with-param>
							</xsl:call-template>
							<input class="title_{$def_lang}" name="title_{$def_lang}" type="text" value="{.}"/>
						</xsl:otherwise>
					</xsl:choose>
					</div>
				</div>
			</div>

</xsl:template>


<xsl:template match="description">

		<div class="input_holder">
			<div id="basic_lang_input">
				<div>
					<div class="input_title">description:</div> 
					
					<xsl:choose>
						<xsl:when test="./@lang">
					
							<xsl:call-template name="lang_set" >
								<xsl:with-param name="lang">
									<xsl:value-of select="./@lang" />
								</xsl:with-param>
							</xsl:call-template>
								
							<textarea class="description_{./@lang}" name="description_{./@lang}" >
								<xsl:choose>
									<xsl:when test=". != ''">
										<xsl:value-of select="."></xsl:value-of>
									</xsl:when> 
									<xsl:otherwise>&#160;</xsl:otherwise> <!-- without space textarea collapses -->
								</xsl:choose>
							</textarea>
							
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="lang_set" >
								<xsl:with-param name="lang">
									<xsl:value-of select="$def_lang" />
								</xsl:with-param>
							</xsl:call-template>	
							<textarea class="description_{$def_lang}" name="description_{$def_lang}" >
								<xsl:choose>
									<xsl:when test=". != ''">
										<xsl:value-of select="."></xsl:value-of>
									</xsl:when> 
									<xsl:otherwise>&#160;</xsl:otherwise> <!-- without space textarea collapses -->
								</xsl:choose>
							</textarea>						
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</div>
		</div>

</xsl:template>

<!-- read languages from XML and set selected language -->
<xsl:template name="lang_set">
	<xsl:param name="lang" />
	<select class="language_selection">
		<xsl:for-each select="document('languages.xml')//option">
				
			<xsl:choose>
				<xsl:when test="$lang = ./@value">
					<option value="{./@value}" selected="selected">
						<xsl:value-of select="." />
					</option>
					
				</xsl:when>
				<xsl:otherwise><xsl:copy-of select="." /></xsl:otherwise>
			</xsl:choose>
				
		</xsl:for-each>
	</select>
</xsl:template>


<xsl:template name="wikidata_entry">
	<xsl:param name="titleName" />
	

		<div class="input_holder">
			<div id="basic_input_data_auto">
				<div>
					<div class="input_title"><xsl:value-of select="$titleName" />:</div> 
					<div class="labelright">
						<div class="link openwikidata">wikidata</div>
					</div>
					<input name="wikidata_location" class="autocomplete wikidata_location" type="text" />
				</div>
			</div>
		</div>	

	
</xsl:template>




<xsl:template name="empty_input">
	<xsl:param name="titleName" />
	

		<div class="input_holder">
			<div id="basic_input_data">
				<div>
					<div class="input_title"><xsl:value-of select="$titleName" />:</div> 

					<input class="{$titleName}" name="{$titleName}" type="text" />
				</div>
			</div>
		</div>	
</xsl:template>




<xsl:template match="commons_title">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">commons_title:</div> 
						<input class="commons_title" name="commons_title" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>






<xsl:template match="institution">

			<div class="input_holder">
				<div id="basic_lang_input">
					<div>
						<div class="input_title">institution:</div> 
						<input class="institution" name="institution" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>




<xsl:template match="author">

			<div class="input_holder">
				<div id="basic_lang_input">
					<div>
						<div class="input_title">author:</div> 
						<input class="author" name="author" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>


<xsl:template match="location">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">location:</div> 
						<input class="location" name="location" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>

<xsl:template match="permission">

			<div class="input_holder">
				<div id="basic_lang_input">
					<div>
						<div class="input_title">permission:</div> 
						<input class="permission" name="permission" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>




<xsl:template match="accession_number">

			<div class="input_holder">
				<div id="basic_lang_input">
					<div>
						<div class="input_title">accession number:</div> 
						<input class="accession_number" name="accession_number" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>



<xsl:template match="commons_url">
	
			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">commons_url:</div> 
						<input class="commons_url" name="commons_url" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>




<xsl:template match="location">
	
			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">location:</div> 
						<input class="location" name="location" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>




<xsl:template match="wikidata_location">
	
			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">wikidata location:</div> 
						<input name="wikidata_location" class="autocomplete wikidata_location" type="text" value="{.}" />
					</div>
				</div>
			</div>

</xsl:template>


<xsl:template match="projection">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">projection:</div> 
						<input class="projection" name="projection" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>


<xsl:template match="heading">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">heading:</div> 
						<input class="heading" name="heading" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>


<xsl:template match="scale">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">scale:</div> 
						<input class="scale" name="scale" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>


<xsl:template match="latitude">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">latitude:</div> 
						<input class="latitude" name="latitude" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>



<xsl:template match="longitude">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">longitude:</div> 
						<input class="longitude" name="longitude" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>



<xsl:template match="record/set">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">set:</div> 
						<input class="set" name="set" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>




<xsl:template match="sheet">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">sheet:</div> 
						<input class="sheet" name="sheet" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>

<xsl:template match="category">
	
			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">category:</div> 
						<input class="category"  name="category" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>



<xsl:template match="uri">
	
			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">uri:</div> 
						<input class="uri" name="uri" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>




<xsl:template match="publisher">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">publisher:</div> 
						<input name="publisher" class="publisher" type="text" value="{.}"/>
					</div>
				</div>
			</div>
  
</xsl:template>






<xsl:template match="date">
	
		<div class="input_holder">
			<div id="basic_input">
				<div>
					<div class="input_title">date:</div> 
					<input class="date" name="date" type="text" value="{.}" />
					date precision: <select class="other_date_select">
						<option name="no_other_date">no other date</option>
						<option name="after">after</option>
						<option name="before">before</option>
						<option name="circa">circa</option>
						<option name="decade">decade (1960's)</option>
						<option name="century">century (19th)</option>
						<option class="select-dash" disabled="disabled">----range----</option>

					</select>
				</div>
			</div>
		</div>
   
</xsl:template>


<xsl:template match="map_date">
	
		<div class="input_holder">
			<div id="basic_input">
				<div>
					<div class="input_title">date:</div> 
					<input class="map_date" name="map_date" type="text" value="{.}" />
					date precision: <select class="other_date_select">
						<option name="no_other_date">no other date</option>
						<option name="after">after</option>
						<option name="before">before</option>
						<option name="circa">circa</option>
						<option name="decade">decade (1960's)</option>
						<option name="century">century (19th)</option>
						<option class="select-dash" disabled="disabled">----range----</option>

					</select>
				</div>
			</div>
		</div>
   
</xsl:template>

<xsl:template match="imgurl">
	
		<div class="input_holder">
			<div id="basic_input">
				<div>
					<div class="input_title">imgurl:</div> 
					<input class="imgurl" name="imgurl" type="text" value="{.}" disabled="disabled"/>
				</div>
			</div>
		</div>
   
</xsl:template>






<xsl:template match="thumbnail">
	<div class="fileurl_pdf">
		<img src="{.}" />
    </div>
</xsl:template>




<xsl:template match="fileurl_jpg">
    <div class="fileurl_jpg">
		<a name="fileurl_jpg" href="{.}"><xsl:value-of select="."/></a>
    </div>
</xsl:template>



<xsl:template match="text()"/>
<xsl:template match="comment()"/>



</xsl:transform>

